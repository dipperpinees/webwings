package handlers

import (
	"net/http"
	"time"

	"github.com/dipperpinees/ci/pkg/auth"
	"github.com/dipperpinees/ci/pkg/db"
	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/dipperpinees/ci/pkg/utils"
	"github.com/dipperpinees/ci/service/user/dtos"
	"github.com/labstack/echo/v4"
)

func generateAccessToken(user *models.User) (string, error) {
	tokenData := make(map[string]interface{})
	tokenData["id"] = user.ID
	tokenData["email"] = user.Email
	return auth.GenerateJWT(tokenData, time.Minute*10)
}

func generateRefreshToken(user *models.User) (string, error) {
	newSession := &models.Session{
		UserID:       user.ID,
		RefreshToken: utils.GenerateRandomKey(24),
		Active:       true,
	}
	if err := db.GetDB().Create(&newSession).Error; err != nil {
		return "", err
	}
	return newSession.RefreshToken, nil
}

func SignIn(c echo.Context) error {
	body := new(dtos.SignUpBody)
	if err := c.Bind(&body); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err := c.Validate(body); err != nil {
		return err
	}
	currentUser := new(models.User)
	if err := db.GetDB().Where("email = ?", body.Email).First(currentUser).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "user not found")
	}
	if !auth.CheckHashedPassword(body.Password, currentUser.Password) {
		return echo.NewHTTPError(http.StatusBadRequest, "wrong password")
	}

	accessToken, err := generateAccessToken(currentUser)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	refreshToken, err := generateRefreshToken(currentUser)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return c.JSON(http.StatusOK, &dtos.AuthResponse{AccessToken: accessToken, RefreshToken: refreshToken})
}

func SignUp(c echo.Context) error {
	body := new(dtos.SignUpBody)
	if err := c.Bind(&body); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err := c.Validate(body); err != nil {
		return err
	}
	password := auth.GenerateHashedPassword(body.Password)
	newUser := &models.User{
		Email:    body.Email,
		Password: string(password),
	}
	if err := db.GetDB().Create(&newUser).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	accessToken, err := generateAccessToken(newUser)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	refreshToken, err := generateRefreshToken(newUser)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return c.JSON(http.StatusOK, &dtos.AuthResponse{AccessToken: accessToken, RefreshToken: refreshToken})
}

func Auth(c echo.Context) error {
	user := c.Get("user")
	return c.JSON(http.StatusOK, user)
}

func RefreshAccessToken(c echo.Context) error {
	refreshToken := c.Request().Header.Get("Authorization")
	currentSession := new(models.Session)
	if err := db.GetDB().Preload("User").Where("refresh_token = ?", refreshToken).First(currentSession).Error; err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
	}
	accessToken, err := generateAccessToken(&currentSession.User)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return c.JSON(http.StatusOK, &map[string]interface{}{
		"accessToken": accessToken,
	})
}

func SignOut(c echo.Context) error {
	refreshToken := c.Request().Header.Get("Authorization")
	if err := db.GetDB().Model(&models.Session{}).Where("refresh_token = ?", refreshToken).Update("active", false).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return c.String(http.StatusOK, "Sign out successfully")
}
