package repo

import (
	"github.com/dipperpinees/ci/service/repo/handlers"
	"github.com/dipperpinees/ci/service/user"
	"github.com/labstack/echo/v4"
)

type Service struct {
	Router *echo.Group
}

func (s *Service) RegisterRoutes(userSvc *user.Service) {
	s.Router.GET("", handlers.GetAllRepos, userSvc.AuthMiddleware)
	s.Router.GET("/:user/:repo", handlers.GetAllBranches, userSvc.AuthMiddleware)
}
