package models

import (
	"time"
)

type RuntimeVersion struct {
	ID          uint      `json:"id"`
	Name        string    `json:"name"`
	Tag         string    `json:"tag"`
	RuntimeName string    `json:"runtime_name"`
	Runtime     Runtimes  `gorm:"foreignKey:RuntimeName;references:Name" json:"-"`
	CreatedAt   time.Time `gorm:"autoCreateTime;column:created_at" json:"createdAt"`
	UpdatedAt   time.Time `gorm:"autoCreateTime;column:updated_at" json:"updatedAt"`
}
