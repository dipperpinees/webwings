package main

import (
	"os"

	"github.com/dipperpinees/ci/configs"
	"github.com/dipperpinees/ci/pkg/db"
	"github.com/dipperpinees/ci/pkg/validator"
	services "github.com/dipperpinees/ci/service"
	_validator "github.com/go-playground/validator"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"go.uber.org/zap"
)

func main() {
	configs.InitConfigs(&configs.Configs{
		DB_PORT:                 os.Getenv("DB_PORT"),
		DB_HOST:                 os.Getenv("DB_HOST"),
		DB_NAME:                 os.Getenv("DB_NAME"),
		DB_USERNAME:             os.Getenv("DB_USERNAME"),
		DB_PASSWORD:             os.Getenv("DB_PASSWORD"),
		PORT:                    os.Getenv("PORT"),
		JWT_SECRET_KEY:          os.Getenv("JWT_SECRET_KEY"),
		GITHUB_OAUTH_CLIENT_ID:  os.Getenv("GITHUB_OAUTH_CLIENT_ID"),
		GITHUB_OAUTH_SECRET_KEY: os.Getenv("GITHUB_OAUTH_SECRET_KEY"),
	})
	db.InitDB()

	server := echo.New()
	server.Use(middleware.CORS())
	logger, _ := zap.NewProduction()
	server.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogURI:    true,
		LogStatus: true,
		LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
			logger.Info("request",
				zap.String("URI", v.URI),
				zap.Int("status", v.Status),
			)

			return nil
		},
	}))
	server.Validator = &validator.CustomValidator{Validator: _validator.New()}

	services.Register(server)

	server.Logger.Fatal(server.Start(":" + configs.GetConfigs().PORT))
}
