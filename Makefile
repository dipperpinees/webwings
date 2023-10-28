run:
	nodemon --exec \
	DB_PORT=2345 \
	DB_HOST=127.0.0.1 \
	DB_NAME=mydb \
	DB_USERNAME=hiepnk \
	DB_PASSWORD=123456 \
	AUTH_SERVICE_URL=0.0.0.0:50001 \
	PORT=50000 \
	JWT_SECRET_KEY=buingoclinh \
	GITHUB_OAUTH_CLIENT_ID=2d8c6d39d2ab7b0640d8 \
	GITHUB_OAUTH_SECRET_KEY=7b10c2083356a07952f7bae6bc68a5c354c51a91 \
	go run cmd/server/main.go --signal SIGTERM

migrate:
	nodemon --exec \
	DB_PORT=2345 \
	DB_HOST=127.0.0.1 \
	DB_NAME=mydb \
	DB_USERNAME=hiepnk \
	DB_PASSWORD=123456 \
	go run cmd/db/main.go migrate --signal SIGTERM

seed:
	nodemon --exec \
	DB_PORT=2345 \
	DB_HOST=127.0.0.1 \
	DB_NAME=mydb \
	DB_USERNAME=hiepnk \
	DB_PASSWORD=123456 \
	go run cmd/db/main.go seed --signal SIGTERM