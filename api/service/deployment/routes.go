package deployment

import (
	"github.com/dipperpinees/ci/service/deployment/handlers"
	"github.com/dipperpinees/ci/service/user"
	"github.com/labstack/echo/v4"
)

type Service struct {
	Router                     *echo.Group
	DeploymentPolicyMiddleware func(next echo.HandlerFunc) echo.HandlerFunc
}

func (s *Service) RegisterRoutes(userSvc *user.Service) {
	s.DeploymentPolicyMiddleware = InitDeploymentPolicyMiddleware()

	s.Router.POST("", handlers.CreateNewDeployment, userSvc.AuthMiddleware)
	s.Router.GET("", handlers.GetDeploymentList, userSvc.AuthMiddleware)
	s.Router.GET("/:id", handlers.GetDeploymentByID, userSvc.AuthMiddleware, s.DeploymentPolicyMiddleware)
}
