package models

import (
	"time"

	"github.com/google/uuid"
)

type Session struct {
	ID           uuid.UUID `gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	UserID       uuid.UUID
	User         User
	RefreshToken string    `gorm:"unique;not null;index"`
	Active       bool      `gorm:"default:true"`
	CreatedAt    time.Time `gorm:"autoCreateTime;column:created_at"`
	UpdatedAt    time.Time `gorm:"autoCreateTime;column:created_at"`
}
