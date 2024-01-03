package models

import (
	"time"
)

type Runtimes struct {
	Name      string           `gorm:"primaryKey" json:"name"`
	Versions  []RuntimeVersion `gorm:"foreignKey:RuntimeName" json:"versions"`
	Image     string           `json:"image"`
	CreatedAt time.Time        `gorm:"autoCreateTime;column:created_at" json:"createdAt"`
	UpdatedAt time.Time        `gorm:"autoCreateTime;column:updated_at" json:"updatedAt"`
}
