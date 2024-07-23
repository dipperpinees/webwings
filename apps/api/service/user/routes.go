package user

import (
	"github.com/dipperpinees/ci/service/user/handlers"
	"github.com/labstack/echo/v4"
)

type Service struct {
	Router               *echo.Group
	AuthMiddleware       func(next echo.HandlerFunc) echo.HandlerFunc
	UserPolicyMiddleware func(next echo.HandlerFunc) echo.HandlerFunc
}

func (s *Service) RegisterRoutes() {
	s.AuthMiddleware = InitAuthMiddleware()
	s.UserPolicyMiddleware = InitUserPolicyMiddleware()

	s.Router.POST("/sign-up", handlers.SignUp)
	s.Router.POST("/sign-in", handlers.SignIn)
	s.Router.POST("/sign-out", handlers.SignOut)
	s.Router.GET("/auth", handlers.Auth, s.AuthMiddleware)
	s.Router.GET("/refresh-access-token", handlers.RefreshAccessToken)

	s.Router.POST("/grant/github", handlers.GrantGithubOAuthAccess, s.AuthMiddleware)
	s.Router.POST("/sign-in/github", handlers.SignInGithubOAuth)
	s.Router.POST("/sign-in/google", handlers.GoogleSignIn)
	s.Router.GET("/oauth", handlers.GetOAuthData, s.AuthMiddleware)

	s.Router.POST("/reset-password", handlers.SendResetPasswordRequest)
	s.Router.PUT("/reset-password", handlers.ResetPassword)

	s.Router.PUT("/:id", handlers.UpdateUser, s.AuthMiddleware, s.UserPolicyMiddleware)
}
