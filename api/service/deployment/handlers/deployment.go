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
	"gorm.io/gorm"

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

	currentOAuth, err := userRepo.GetOAuthByID(body.OAuthID)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	branchData, err := github.GetBranchInfo(currentOAuth.AccessToken, currentOAuth.GitUsername, body.RepoName, body.Branch)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
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
		Domain:        utils.GenerateName(),
		EnvVariables:  body.EnvVariables,
		RuntimeID:     body.RuntimeID,
		Commit:        branchData.Commit.SHA,
	}
	if err := db.GetDB().Create(newDeployment).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	newDeployment.OAuth = *currentOAuth

	currentRuntime := new(models.RuntimeVersion)
	if err := db.GetDB().Find(&currentRuntime).Where("id = ?", newDeployment.RuntimeID).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	newDeployment.Runtime = *currentRuntime

	// register webhooks
	if err := github.RegisterWebhook(currentOAuth.AccessToken, currentOAuth.GitUsername, newDeployment.RepoName); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	// create event
	eventRepo.CreateEvent(&models.Events{
		DeploymentID: newDeployment.ID,
		CommitSHA:    branchData.Commit.SHA,
		Type:         string(enums.INIT_DEPLOY),
		CommitMsg:    branchData.Commit.Commit.Message,
		AutoTrigger:  true,
	})

	// send message to queue
	mq.SendToQueue("DEPLOYMENT", newDeployment)

	return c.JSON(http.StatusOK, newDeployment)
}

func GetDeploymentList(c echo.Context) error {
	user, _ := c.Get("user").(*models.User)

	deploymentList := new([]models.Deployment)
	if err := db.GetDB().
		Order("updated_at desc").
		Preload("Runtime").
		Preload("Events", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at DESC").Limit(1)
		}).
		Find(deploymentList).
		Where("user_id = ?", user.ID).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusOK, deploymentList)
}

func GetDeploymentByID(c echo.Context) error {
	deploymentID := c.Param("id")

	deployment := new(models.Deployment)

	if err := db.GetDB().Where("id = ?", deploymentID).Preload("Events", func(db *gorm.DB) *gorm.DB {
		return db.Order("created_at DESC")
	}).Preload("OAuth").First(deployment).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	deployment.OAuth.AccessToken = ""
	return c.JSON(http.StatusOK, deployment)
}
