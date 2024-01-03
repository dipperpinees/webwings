package handlers

import (
	"net/http"

	"github.com/dipperpinees/ci/pkg/db"
	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/dipperpinees/ci/pkg/github"
	"github.com/dipperpinees/ci/pkg/utils"
	"github.com/dipperpinees/ci/service/user/dtos"
	"github.com/dipperpinees/ci/service/user/repositories"
	"github.com/labstack/echo/v4"
)

func GrantGithubOAuthAccess(c echo.Context) error {
	code := c.QueryParams().Get("code")
	user, _ := c.Get("user").(*models.User)
	token, err := github.GetAccessToken(code)
	if token == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Failed to oauth")
	}
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	githubUser, err := github.GetUserData(token)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	newOAuth := &models.Oauth{
		UserID:        user.ID,
		GitUserId:     githubUser.ID,
		GitUsername:   githubUser.Login,
		AccessToken:   token,
		GitName:       githubUser.Name,
		GitAvatarUrl:  githubUser.Avatar_url,
		GitEmail:      githubUser.Email,
		GitProfileUrl: githubUser.Html_url,
	}
	if err := repositories.CreateOAuth(newOAuth); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return c.JSON(http.StatusOK, "Grant oauth access successfully")
}

func SignInGithubOAuth(c echo.Context) error {
	code := c.QueryParams().Get("code")
	token, err := github.GetAccessToken(code)
	if token == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Failed to oauth")
	}
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	githubUser, err := github.GetUserData(token)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	currentUser, err := repositories.GetUserByEmail(githubUser.Login + "@github.com")
	if err != nil {
		currentUser = &models.User{
			Email:    githubUser.Login + "@github.com",
			Name:     githubUser.Name,
			Password: utils.RandomString(12),
		}
		if err := repositories.CreateUser(currentUser); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}
	}

	currentOAuth, err := repositories.GetUniqueOAuth(githubUser.Login, currentUser.ID)
	if err != nil {
		currentOAuth = &models.Oauth{
			UserID:        currentUser.ID,
			GitUserId:     githubUser.ID,
			GitUsername:   githubUser.Login,
			AccessToken:   token,
			GitName:       githubUser.Name,
			GitAvatarUrl:  githubUser.Avatar_url,
			GitEmail:      githubUser.Email,
			GitProfileUrl: githubUser.Html_url,
		}
		if err := repositories.CreateOAuth(currentOAuth); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}
	} else {
		currentOAuth.AccessToken = token
		currentOAuth.GitName = githubUser.Name
		currentOAuth.GitEmail = githubUser.Email
		currentOAuth.GitAvatarUrl = githubUser.Avatar_url
		currentOAuth.GitProfileUrl = githubUser.Html_url
		if err := db.GetDB().Save(currentOAuth).Error; err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}
	}

	accessToken, err := generateAccessToken(currentUser)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	_, err = generateRefreshToken(currentUser, c)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return c.JSON(http.StatusOK, &dtos.AuthResponse{User: *currentUser, AccessToken: accessToken})
}

func GetOAuthData(c echo.Context) error {
	user, _ := c.Get("user").(*models.User)
	oauthData, err := repositories.GetUserOAuths(user.ID)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusOK, oauthData)
}
