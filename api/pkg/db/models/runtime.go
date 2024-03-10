package models

import (
	"time"
)

type Runtimes struct {
	Name         string           `gorm:"primaryKey" json:"name"`
	Versions     []RuntimeVersion `gorm:"foreignKey:RuntimeName" json:"versions"`
	Image        string           `json:"image"`
	BuildCommand string           `json:"build_command"`
	StartCommand string           `json:"start_command"`
	CreatedAt    time.Time        `gorm:"autoCreateTime;column:created_at" json:"createdAt"`
	UpdatedAt    time.Time        `gorm:"autoCreateTime;column:updated_at" json:"updatedAt"`
}
