package db

import "github.com/dipperpinees/ci/pkg/db/models"

func Seed() {
	db.Create(&[]models.Runtimes{
		{Runtime: "Node"},
		{Runtime: "Go"},
		{Runtime: "Python3"},
		{Runtime: "Docker"},
	})
}
