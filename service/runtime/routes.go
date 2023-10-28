package runtime

import (
	"github.com/dipperpinees/ci/service/runtime/handlers"
	"github.com/dipperpinees/ci/service/user"
	"github.com/labstack/echo/v4"
)

type Service struct {
	Router *echo.Group
}

func (s *Service) RegisterRoutes(userSvc *user.Service) {
	s.Router.GET("", handlers.GetAllRuntimes, userSvc.AuthMiddleware)
	s.Router.GET("", handlers.GetAllRuntimes, userSvc.AuthMiddleware)
}
