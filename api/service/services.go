package services

import (
	"github.com/dipperpinees/ci/service/deployment"
	"github.com/dipperpinees/ci/service/repo"
	"github.com/dipperpinees/ci/service/runtime"
	"github.com/dipperpinees/ci/service/user"
	"github.com/labstack/echo/v4"
)

func Register(server *echo.Echo) {
	userService := user.Service{Router: server.Group("/user")}
	userService.RegisterRoutes()

	repoService := repo.Service{Router: server.Group("/repo")}
	repoService.RegisterRoutes(&userService)

	runtimesService := runtime.Service{Router: server.Group("/runtimes")}
	runtimesService.RegisterRoutes(&userService)

	deploymentService := deployment.Service{Router: server.Group("/deployment")}
	deploymentService.RegisterRoutes(&userService)
}
