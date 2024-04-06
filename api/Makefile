SHELL := /bin/bash

include .env
export $(shell sed 's/=.*//' .env)

.PHONY: run

run:
	nodemon --exec go run cmd/server/main.go --signal SIGTERM

run-consumer:
	nodemon --exec go run cmd/consumer/main.go --signal SIGTERM

migrate:
	go run cmd/db/main.go migrate --signal SIGTERM

seed:
	go run cmd/db/main.go seed --signal SIGTERM