package user

import (
	"github.com/dipperpinees/ci/service/user/handlers"
	"github.com/labstack/echo/v4"
)

type Service struct {
	Router         *echo.Group
	AuthMiddleware func(next echo.HandlerFunc) echo.HandlerFunc
}

func (s *Service) RegisterRoutes() {
	s.AuthMiddleware = InitAuthMiddleware()
	s.Router.POST("/sign-up", handlers.SignUp)
	s.Router.POST("/sign-in", handlers.SignIn)
	s.Router.GET("/auth", handlers.Auth, s.AuthMiddleware)
	s.Router.GET("/refresh-access-token", handlers.RefreshAccessToken)
	s.Router.GET("/oauth/github", handlers.GithubOAuth)
	s.Router.GET("/oauth", handlers.GetOAuthData, s.AuthMiddleware)
}
