package models

import (
	"time"

	"github.com/google/uuid"
)

type ResetPassword struct {
	ID        uuid.UUID `gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	SecretKey string
	UserID    uuid.UUID
	User      User
	Active    bool
	CreatedAt time.Time `gorm:"autoCreateTime;column:created_at"`
	UpdatedAt time.Time `gorm:"autoCreateTime;column:updated_at"`
}
