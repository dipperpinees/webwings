package db

import "github.com/dipperpinees/ci/pkg/db/models"

func Migrate() {
	db.AutoMigrate(
		&models.User{},
		&models.Session{},
		&models.Oauth{},
		&models.RuntimeVersion{},
		&models.Runtimes{},
		&models.ResetPassword{},
		&models.Deployment{},
	)
}
