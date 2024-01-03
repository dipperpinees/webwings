package db

import (
	"fmt"

	"github.com/dipperpinees/ci/configs"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func InitDB() {
	config := configs.GetConfigs()
	dsn := "host=" + config.DB_HOST + " user=" + config.DB_USERNAME + " password=" + config.DB_PASSWORD + " dbname=" + config.DB_NAME + " port=" + config.DB_PORT + " sslmode=disable TimeZone=Asia/Shanghai"
	_db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Printf("Error connecting to database : error=%v", err)
	}
	db = _db
}

func GetDB() *gorm.DB {
	return db
}
