package models

import (
	"time"

	"github.com/dipperpinees/ci/pkg/db/models/enums"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Deployment struct {
	gorm.Model
	ID            uuid.UUID            `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	UserID        uuid.UUID            `json:"user_id" gorm:"uniqueIndex:idx_name_user"`
	User          User                 `json:"-"`
	OAuthID       uuid.UUID            `json:"oauth_id"`
	OAuth         Oauth                `json:"oauth"`
	Name          string               `json:"name" gorm:"uniqueIndex:idx_name_user"`
	RepoName      string               `json:"repo"`
	RepoURL       string               `json:"repo_url"`
	AutoDeploy    bool                 `json:"auto_deploy"`
	BuildCommand  string               `json:"build_command"`
	StartCommand  string               `json:"start_command"`
	Branch        string               `json:"branch"`
	RootDirectory string               `json:"root"`
	Type          enums.DeploymentType `json:"type"`
	Domain        string               `json:"domain" gorm:"unique"`
	Events        []Events             `json:"event"`
	CreatedAt     time.Time            `gorm:"autoCreateTime;column:created_at" json:"created_at"`
	UpdatedAt     time.Time            `gorm:"autoCreateTime;column:updated_at" json:"updated_at"`
	EnvVariables  string               `gorm:"default:'[]'" json:"env"`
	RuntimeID     uint                 `json:"-"`
	Runtime       RuntimeVersion       `json:"runtime"`
	Commit        string               `json:"commit"`
}
