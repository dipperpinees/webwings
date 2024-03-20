package handlers

import (
	"net/http"

	"github.com/dipperpinees/ci/pkg/db"
	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/dipperpinees/ci/pkg/db/models/enums"
	"github.com/dipperpinees/ci/pkg/github"
	"github.com/dipperpinees/ci/pkg/mq"
	"github.com/dipperpinees/ci/pkg/utils"
	"github.com/dipperpinees/ci/service/deployment/dtos"
	userRepo "github.com/dipperpinees/ci/service/user/repositories"

	eventRepo "github.com/dipperpinees/ci/service/event/repositories"
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
		StartCommand:  body.StartCommand,
		Type:          body.Type,
		UserID:        user.ID,
		Status:        "PROGESSING",
		Domain:        utils.GenerateName(),
		EnvVariables:  body.EnvVariables,
		RuntimeID:     body.RuntimeID,
	}
	if err := db.GetDB().Create(newDeployment).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	currentOAuth, err := userRepo.GetOAuthByID(newDeployment.OAuthID)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	newDeployment.OAuth = *currentOAuth

	currentRuntime := new(models.RuntimeVersion)
	if err := db.GetDB().Find(&currentRuntime).Where("id = ?", newDeployment.RuntimeID).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	newDeployment.Runtime = *currentRuntime

	branchData, err := github.GetBranchInfo(currentOAuth.AccessToken, currentOAuth.GitUsername, newDeployment.RepoName, newDeployment.Branch)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	// create event
	eventRepo.CreateEvent(&models.Events{
		DeploymentID: newDeployment.ID,
		CommitURL:    branchData.Commit.HtmlUrl,
		CommitSHA:    branchData.Commit.SHA,
		Type:         string(enums.INIT_DEPLOY),
		AutoTrigger:  true,
	})

	// send message to queue
	mq.SendToQueue("DEPLOYMENT", newDeployment)

	return c.JSON(http.StatusOK, newDeployment)
}

func GetDeploymentList(c echo.Context) error {
	user, _ := c.Get("user").(*models.User)

	deploymentList := new([]models.Deployment)
	if err := db.GetDB().Order("updated_at desc").Find(deploymentList).Where("user_id = ?", user.ID).Preload("WebService").Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusOK, deploymentList)
}

func GetDeploymentByID(c echo.Context) error {
	deploymentID := c.Param("id")

	deployment := new(models.Deployment)

	if err := db.GetDB().Where("id = ?", deploymentID).Preload("OAuth").Preload("Events").First(deployment).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	deployment.OAuth.AccessToken = ""
	return c.JSON(http.StatusOK, deployment)
}
