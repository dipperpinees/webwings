package main

import (
	"fmt"
	"os"

	"github.com/dipperpinees/ci/configs"
	"github.com/dipperpinees/ci/pkg/db"
)

func main() {
	configs.InitConfigs(&configs.Configs{
		DB_PORT:     os.Getenv("DB_PORT"),
		DB_HOST:     os.Getenv("DB_HOST"),
		DB_NAME:     os.Getenv("DB_NAME"),
		DB_USERNAME: os.Getenv("DB_USERNAME"),
		DB_PASSWORD: os.Getenv("DB_PASSWORD"),
	})
	db.InitDB()
	args := os.Args[1]
	fmt.Println(args)
	if args == "migrate" {
		db.Migrate()
	}
	if args == "seed" {
		db.Seed()
	}
}
