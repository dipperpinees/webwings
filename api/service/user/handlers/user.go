package handlers

import (
	"net/http"

	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/dipperpinees/ci/service/user/dtos"
	"github.com/dipperpinees/ci/service/user/repositories"
	"github.com/labstack/echo/v4"
)

func UpdateUser(c echo.Context) error {
	updateData := new(dtos.UserUpdated)
	user, _ := c.Get("user").(*models.User)
	if err := c.Bind(updateData); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	user.Name = updateData.Name
	if err := repositories.UpdateUser(user); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusOK, "Update user successfully")
}
