package handlers

import (
	"net/http"

	"github.com/dipperpinees/ci/pkg/db"
	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/dipperpinees/ci/pkg/db/models/enums"
	"github.com/dipperpinees/ci/pkg/mq"
	"github.com/dipperpinees/ci/service/deployment/dtos"
	userRepo "github.com/dipperpinees/ci/service/user/repositories"
	"github.com/labstack/echo/v4"
)

func CreateNewDeployment(c echo.Context) error {
	body := new(dtos.CreateDeploymentBody)
	user, _ := c.Get("user").(*models.User)
	if err := c.Bind(&body); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err := c.Validate(body); err != nil {
		return err
	}
	newDeployment := &models.Deployment{
		Name:          body.Name,
		OAuthID:       body.OAuthID,
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
	if newDeployment.Type == enums.WEB {
		newWebService := models.WebServiceDeployment{
			DeploymentID: newDeployment.ID,
			RuntimeID:    body.RuntimeID,
		}
		if err := db.GetDB().Create(newWebService).Error; err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}
		newDeployment.WebService = newWebService
	}

	currentOAuth, err := userRepo.GetOAuthByID(newDeployment.OAuthID)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	newDeployment.OAuth = *currentOAuth

	// send message to queue
	mq.SendToQueue("DEPLOYMENT", newDeployment)

	return c.JSON(http.StatusOK, newDeployment)
}

func GetDeploymentList(c echo.Context) error {

}
