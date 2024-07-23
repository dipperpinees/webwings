package db

import "github.com/dipperpinees/ci/pkg/db/models"

func Seed() {
	db.Create(&[]models.Runtimes{
		{Name: "Node", Image: "node", BuildCommand: "pnpm build", StartCommand: "pnpm start"},
		{Name: "Go", Image: "go", BuildCommand: "go build -o app", StartCommand: "./app"},
		{Name: "Python3", Image: "python", BuildCommand: "pip install --no-cache-dir -r requirements.txt", StartCommand: "python manage.py runserver 0.0.0.0:8000"},
	})
	db.Create(&[]models.RuntimeVersion{
		{RuntimeName: "Node", Name: "21.1", Tag: "21.1-alpine3.17"},
		{RuntimeName: "Node", Name: "20.9", Tag: "20.9-alpine3.17"},
		{RuntimeName: "Node", Name: "19.9", Tag: "19.9-alpine3.17"},
		{RuntimeName: "Node", Name: "18.18.2", Tag: "18.18.2-alpine3.17"},
		{RuntimeName: "Node", Name: "16.20.2", Tag: "16.20.2-alpine3.17"},
		{RuntimeName: "Node", Name: "14.20.1", Tag: "14.20.1-alpine3.16"},
		{RuntimeName: "Go", Name: "1.22.2", Tag: "1.22.2-alpine3.19"},
		{RuntimeName: "Go", Name: "1.21.3", Tag: "1.21.3-alpine3.17"},
		{RuntimeName: "Go", Name: "1.20.10", Tag: "1.20.10-alpine3.17"},
		{RuntimeName: "Go", Name: "1.19.13", Tag: "1.19.13-alpine3.17"},
		{RuntimeName: "Go", Name: "1.18.10", Tag: "1.18.10-alpine3.17"},
		{RuntimeName: "Python3", Name: "3.12.0", Tag: "3.12.0-alpine3.17"},
		{RuntimeName: "Python3", Name: "3.11.6", Tag: "3.11.6-alpine3.17"},
		{RuntimeName: "Python3", Name: "3.10.13", Tag: "3.10.13-alpine3.17"},
		{RuntimeName: "Python3", Name: "3.9.18", Tag: "3.9.18-alpine3.17"},
	})
}
