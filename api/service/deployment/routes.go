package deloyment

import (
	"github.com/dipperpinees/ci/service/deployment/handlers"
	"github.com/dipperpinees/ci/service/user"
	"github.com/labstack/echo/v4"
)

type Service struct {
	Router *echo.Group
}

func (s *Service) RegisterRoutes(userSvc *user.Service) {
	s.Router.POST("", handlers.CreateNewDeployment, userSvc.AuthMiddleware)
}
