package handlers

import (
	"net/http"

	"github.com/dipperpinees/ci/pkg/db"
	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/dipperpinees/ci/service/deployment/dtos"
	"github.com/labstack/echo/v4"
)

func CreateNewDeployment(c echo.Context) error {
	body := new(dtos.CreateDeploymentBody)
	user, _ := c.Get("user").(*models.User)
	if err := c.Bind(&body); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	newDeployment := &models.Deployment{
		OAuthID:       body.OAuthID,
		RuntimeID:     body.RuntimeID,
		Branch:        body.Branch,
		RepoName:      body.RepoName,
		RepoURL:       body.RepoURL,
		AutoDeploy:    body.AutoDeploy,
		BuildCommand:  body.BuildCommand,
		RootDirectory: body.RootDirectory,
		Type:          body.Type,
		UserID:        user.ID,
	}
	if err := db.GetDB().Create(newDeployment).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return c.JSON(http.StatusOK, newDeployment)
}
