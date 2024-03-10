package handlers

import (
	"net/http"

	eventRepo "github.com/dipperpinees/ci/service/event/repositories"
	"github.com/labstack/echo/v4"
)

func GetAllEvents(c echo.Context) error {
	deploymentID := c.Param("id")
	events, err := eventRepo.GetEventsOfDeployment(deploymentID)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusOK, events)
}
