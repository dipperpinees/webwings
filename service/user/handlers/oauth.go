package handlers

import (
	"net/http"

	"github.com/dipperpinees/ci/pkg/db"
	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/dipperpinees/ci/pkg/github"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func GithubOAuth(c echo.Context) error {
	code := c.QueryParams().Get("code")
	userId := uuid.MustParse(c.QueryParams().Get("user"))
	token, err := github.GetAccessToken(code)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	githubUser, err := github.GetUserData(token)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	newOAuth := &models.Oauth{
		UserID:        userId,
		GitUserId:     githubUser.ID,
		GitUsername:   githubUser.Login,
		AccessToken:   token,
		GitName:       githubUser.Name,
		GitAvatarUrl:  githubUser.Avatar_url,
		GitEmail:      githubUser.Email,
		GitProfileUrl: githubUser.Html_url,
	}
	if err := db.GetDB().Create(newOAuth).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return c.JSON(http.StatusOK, githubUser)
}

func GetOAuthData(c echo.Context) error {
	user, _ := c.Get("user").(*models.User)
	oauthData := new([]models.Oauth)
	if err := db.GetDB().Where("user_id = ?", user.ID).Find(oauthData).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return c.JSON(http.StatusOK, oauthData)
}
