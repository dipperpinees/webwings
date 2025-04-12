package main

import (
	"os"

	"github.com/dipperpinees/ci/configs"
	"github.com/dipperpinees/ci/pkg/db"
	"github.com/dipperpinees/ci/pkg/mq/consumers"
)

func main() {
	configs.InitConfigs(&configs.Configs{
		DB_PORT:                 os.Getenv("DB_PORT"),
		DB_HOST:                 os.Getenv("DB_HOST"),
		DB_NAME:                 os.Getenv("DB_NAME"),
		DB_USERNAME:             os.Getenv("DB_USERNAME"),
		DB_PASSWORD:             os.Getenv("DB_PASSWORD"),
		PORT:                    os.Getenv("API_PORT"),
		JWT_SECRET_KEY:          os.Getenv("JWT_SECRET_KEY"),
		GITHUB_OAUTH_CLIENT_ID:  os.Getenv("GITHUB_OAUTH_CLIENT_ID"),
		GITHUB_OAUTH_SECRET_KEY: os.Getenv("GITHUB_OAUTH_SECRET_KEY"),
		EMAIL:                   os.Getenv("EMAIL"),
		EMAIL_PASSWORD:          os.Getenv("EMAIL_PASSWORD"),
		AMQP_URI:                os.Getenv("AMQP_URI"),
	})
	db.InitDB()
	consumers.Handler()
}
