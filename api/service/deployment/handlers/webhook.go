package handlers

import (
	"net/http"
	"strings"

	"github.com/dipperpinees/ci/pkg/db"
	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/dipperpinees/ci/pkg/db/models/enums"
	"github.com/dipperpinees/ci/pkg/mq"
	"github.com/dipperpinees/ci/service/deployment/dtos"
	"github.com/labstack/echo/v4"
)

func GithubWebhooks(c echo.Context) error {
	body := new(dtos.GithubWebhookBody)
	if err := c.Bind(&body); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if body.Ref == "" {
		return nil
	}

	branchName := strings.TrimPrefix(body.Ref, "refs/heads/")

	deploymentList := new([]models.Deployment)
	if err := db.GetDB().Where("repo_url = ?", body.Repository.HtmlUrl).Preload("OAuth").Preload("Runtime").Find(deploymentList).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	for _, deployment := range *deploymentList {
		if !deployment.AutoDeploy {
			continue
		}

		if deployment.Branch != branchName {
			continue
		}

		deployment.Commit = body.After

		if err := db.GetDB().Save(&deployment).Error; err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		mq.SendToQueue("EVENT", &models.Events{
			DeploymentID: deployment.ID,
			CommitSHA:    body.After,
			Type:         string(enums.NEW_DEPLOY),
			CommitMsg:    body.Commit.Message,
			AutoTrigger:  true,
		})

		mq.SendToQueue("DEPLOYMENT", deployment)
	}

	return nil
}
