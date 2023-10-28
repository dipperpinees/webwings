package models

import (
	"time"

	"github.com/google/uuid"
)

type Oauth struct {
	ID            uuid.UUID `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	UserID        uuid.UUID `gorm:"uniqueIndex:idx_userid_username" json:"userId"`
	User          User      `json:"-"`
	GitUserId     int32     `gorm:"not null" json:"gitUserId"`
	GitUsername   string    `gorm:"uniqueIndex:idx_userid_username" json:"username"`
	AccessToken   string    `json:"-"`
	GitProfileUrl string    `json:"url"`
	GitEmail      string    `json:"email"`
	GitName       string    `json:"name"`
	GitAvatarUrl  string    `json:"avatarUrl"`
	CreatedAt     time.Time `gorm:"autoCreateTime;column:created_at" json:"createdAt"`
	UpdatedAt     time.Time `gorm:"autoCreateTime;column:created_at" json:"updatedAt"`
}
