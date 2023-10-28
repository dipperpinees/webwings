package handlers

import (
	"net/http"

	"github.com/dipperpinees/ci/pkg/db"
	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/dipperpinees/ci/service/runtime/dtos"
	"github.com/labstack/echo/v4"
)

func GetAllRuntimes(c echo.Context) error {
	data := new([]models.Runtimes)

	if err := db.GetDB().Find(data).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusOK, data)
}

func GetCurrentRuntimes(c echo.Context) error {
	params := new(dtos.CurrentRuntimeParams)
	if err := c.Bind(params); err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}
	var currentRuntime string
	switch params.Language {
	case "Javascripts":
	case "Typescripts":
		currentRuntime = ""
	}
}
