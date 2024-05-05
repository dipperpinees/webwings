package handlers

import (
	"net/http"
	"time"

	"github.com/dipperpinees/ci/pkg/auth"
	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/dipperpinees/ci/pkg/google"
	"github.com/dipperpinees/ci/pkg/utils"
	"github.com/dipperpinees/ci/service/user/dtos"
	"github.com/dipperpinees/ci/service/user/repositories"
	"github.com/labstack/echo/v4"
)

func generateAccessToken(user *models.User) (string, error) {
	tokenData := make(map[string]interface{})
	tokenData["id"] = user.ID
	tokenData["email"] = user.Email
	return auth.GenerateJWT(tokenData, time.Minute*10)
}

func generateRefreshToken(user *models.User, c echo.Context) (string, error) {
	newSession := &models.Session{
		UserID:       user.ID,
		RefreshToken: "wwg_" + auth.GenerateRefreshToken(user.ID),
		Active:       true,
	}
	if err := repositories.CreateSession(newSession); err != nil {
		return "", err
	}
	cookie := new(http.Cookie)
	cookie.Name = "refresh_token"
	cookie.Value = newSession.RefreshToken
	cookie.Path = "/"
	cookie.HttpOnly = true
	cookie.Expires = time.Now().AddDate(1, 0, 0)
	// cookie.Secure = true
	// cookie.SameSite = http.SameSiteStrictMode

	c.SetCookie(cookie)
	return newSession.RefreshToken, nil
}

func SignIn(c echo.Context) error {
	body := new(dtos.SignUpBody)
	if err := c.Bind(&body); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err := c.Validate(body); err != nil {
		return err
	}
	currentUser, err := repositories.GetUserByEmail(body.Email)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if !auth.CheckHashedPassword(body.Password, currentUser.Password) {
		return echo.NewHTTPError(http.StatusBadRequest, "wrong password")
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

func SignUp(c echo.Context) error {
	body := new(dtos.SignUpBody)
	if err := c.Bind(&body); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err := c.Validate(body); err != nil {
		return err
	}
	if body.Name == "" {
		body.Name = "user_" + utils.RandomString(6)
	}
	password := auth.GenerateHashedPassword(body.Password)
	newUser := &models.User{
		Email:    body.Email,
		Password: string(password),
		Name:     body.Name,
	}
	if err := repositories.CreateUser(newUser); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	accessToken, err := generateAccessToken(newUser)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	_, err = generateRefreshToken(newUser, c)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return c.JSON(http.StatusOK, &dtos.AuthResponse{User: *newUser, AccessToken: accessToken})
}

func Auth(c echo.Context) error {
	user := c.Get("user")
	return c.JSON(http.StatusOK, user)
}

func RefreshAccessToken(c echo.Context) error {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "Refresh access token failed")
	}
	currentSession, err := repositories.GetSessionByRefreshToken(refreshToken.Value)
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
	}
	accessToken, err := generateAccessToken(&currentSession.User)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return c.JSON(http.StatusOK, &map[string]interface{}{
		"accessToken": accessToken,
	})
}

func SignOut(c echo.Context) error {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "Sign out failed")
	}
	if err := repositories.DisableSessionByRefreshToken(refreshToken.Value); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return c.String(http.StatusOK, "Sign out successfully")
}

func GoogleSignIn(c echo.Context) error {
	body := new(dtos.UserGoogleInput)
	if err := c.Bind(&body); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	ggUser, err := google.GetUser(body.AccessToken)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	user := new(models.User)
	user.Email = ggUser.Email
	user.Name = ggUser.Name
	user.Password = "gg_password"
	if err := repositories.FindOneOrCreateUser(user); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	accessToken, err := generateAccessToken(user)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	_, err = generateRefreshToken(user, c)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return c.JSON(http.StatusOK, &dtos.AuthResponse{User: *user, AccessToken: accessToken})
}
