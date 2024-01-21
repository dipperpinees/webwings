package models

import (
	"time"

	"github.com/google/uuid"
)

type Oauth struct {
	ID            uuid.UUID `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	UserID        uuid.UUID `gorm:"uniqueIndex:idx_userid_username" json:"user_id"`
	User          User      `json:"-"`
	GitUserId     int32     `gorm:"not null" json:"git_user_id"`
	GitUsername   string    `gorm:"uniqueIndex:idx_userid_username" json:"username"`
	AccessToken   string    `json:"access_token"`
	GitProfileUrl string    `json:"url"`
	GitEmail      string    `json:"email"`
	GitName       string    `json:"name"`
	GitAvatarUrl  string    `json:"avatarUrl"`
	CreatedAt     time.Time `gorm:"autoCreateTime;column:created_at" json:"created_at"`
	UpdatedAt     time.Time `gorm:"autoCreateTime;column:updated_at" json:"updated_at"`
}
