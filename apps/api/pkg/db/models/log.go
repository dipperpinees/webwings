package models

import (
	"time"

	"github.com/google/uuid"
)

type Logs struct {
	ID           uint       `gorm:"primaryKey" json:"id"`
	DeploymentID uuid.UUID  `json:"deployment_id"`
	Deployment   Deployment `json:"-"`
	Type         string     `json:"type"`
	Message      string     `json:"message"`
	CreatedAt    time.Time  `gorm:"autoCreateTime;column:created_at" json:"created_at"`
	UpdatedAt    time.Time  `gorm:"autoCreateTime;column:updated_at" json:"updated_at"`
}
