package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID        uuid.UUID `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	Email     string    `gorm:"unique;not null" json:"email"`
	Name      string    `json:"name"`
	Password  string    `json:"-"`
	CreatedAt time.Time `gorm:"autoCreateTime;column:created_at" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoCreateTime;column:updated_at" json:"updatedAt"`
}
