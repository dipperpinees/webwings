package models

import (
	"time"

	"github.com/google/uuid"
)

type Events struct {
	ID           uuid.UUID  `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	DeploymentID uuid.UUID  `gorm:"primaryKey" json:"-"`
	Deployment   Deployment `json:"-"`
	CommitURL    string     `json:"commit_url"`
	CommitSHA    string     `json:"commit_sha"`
	Type         string     `json:"type"`
	AutoTrigger  bool       `json:"auto_trigger"`
	CreatedAt    time.Time  `gorm:"autoCreateTime;column:created_at" json:"created_at"`
	UpdatedAt    time.Time  `gorm:"autoCreateTime;column:updated_at" json:"updated_at"`
}
