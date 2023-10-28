package models

import (
	"time"

	"github.com/google/uuid"
)

type Runtimes struct {
	ID        uuid.UUID `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	Runtime   string    `json:"runtime"`
	CreatedAt time.Time `gorm:"autoCreateTime;column:created_at" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoCreateTime;column:created_at" json:"updatedAt"`
}
