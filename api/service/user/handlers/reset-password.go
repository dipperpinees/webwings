package handlers

import (
	"encoding/base64"
	"fmt"
	"net/http"

	"github.com/dipperpinees/ci/configs"
	"github.com/dipperpinees/ci/pkg/auth"
	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/dipperpinees/ci/pkg/mail"
	"github.com/dipperpinees/ci/pkg/mail/template"
	"github.com/dipperpinees/ci/pkg/utils"
	"github.com/dipperpinees/ci/service/user/dtos"
	"github.com/dipperpinees/ci/service/user/repositories"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func SendResetPasswordRequest(c echo.Context) error {
	body := new(dtos.SendResetPasswordMailBody)
	if err := c.Bind(&body); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if err := c.Validate(body); err != nil {
		return err
	}
	currentUser, err := repositories.GetUserByEmail(body.Email)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	// Disable old code
	if err := repositories.DisableOldUserCode(currentUser.ID); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	newResetPasswordData := &models.ResetPassword{
		SecretKey: utils.RandomString(12),
		UserID:    currentUser.ID,
		Active:    true,
	}
	if err := repositories.CreateResetPassword(newResetPasswordData); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	resetLink := fmt.Sprintf("%s?code=%s&user=%s", body.RedirectState, newResetPasswordData.SecretKey, base64.StdEncoding.EncodeToString([]byte(currentUser.ID.String())))
	if err := mail.Send(configs.GetConfigs().EMAIL, configs.GetConfigs().EMAIL_PASSWORD, []string{body.Email}, "Reset your password", template.ResetPasswordTemplate(resetLink)); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusOK, "Send reset password email successfully")
}

func ResetPassword(c echo.Context) error {
	body := new(dtos.ResetPasswordBody)
	if err := c.Bind(&body); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if err := c.Validate(body); err != nil {
		return err
	}
	userID, err := base64.StdEncoding.DecodeString(body.UserID)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	currentCodeData, err := repositories.GetActiveResetPassword(body.Code, uuid.UUID(userID))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	newHashedPassword := auth.GenerateHashedPassword(body.NewPassword)
	currentUser, err := repositories.GetUserByID(uuid.UUID(userID))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	// Update password
	currentUser.Password = newHashedPassword
	if err := repositories.UpdateUser(currentUser); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	currentCodeData.Active = false
	if err := repositories.UpdateResetPassword(currentCodeData); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusOK, "Reset password successfully")
}
