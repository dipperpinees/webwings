package handlers

import (
	"net/http"

	"github.com/dipperpinees/ci/pkg/db"
	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/dipperpinees/ci/pkg/github"
	"github.com/dipperpinees/ci/service/repo/dtos"
	"github.com/labstack/echo/v4"
)

func GetAllRepos(c echo.Context) error {
	user, _ := c.Get("user").(*models.User)
	oauth := new(models.Oauth)
	if err := db.GetDB().Where("user_id = ?", user.ID).First(&oauth).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	repo, err := github.GetUserRepositories(oauth.AccessToken)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return c.JSON(http.StatusOK, &repo)
}

func GetAllBranches(c echo.Context) error {
	user, _ := c.Get("user").(*models.User)
	query := new(dtos.BranchQueryParams)
	if err := c.Bind(query); err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}
	oauth := new(models.Oauth)
	if err := db.GetDB().Where("user_id = ?", user.ID).Where("git_username = ?", query.Username).First(oauth).Error; err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}
	branchData, err := github.GetBranchesList(oauth.AccessToken, query.Username, query.Repo)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return c.JSON(http.StatusOK, branchData)
}
