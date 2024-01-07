package models

import (
	"time"

	enums "github.com/dipperpinees/ci/pkg/db/models/enums"
	"github.com/google/uuid"
)

type Deployment struct {
	ID            uuid.UUID              `gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	UserID        uuid.UUID              `json:"user_id"`
	User          User                   `json:"-"`
	OAuthID       uuid.UUID              `json:"oauth"`
	OAuth         Oauth                  `json:"-"`
	Name          string                 `json:"name"`
	RepoName      string                 `json:"repo"`
	RepoURL       string                 `json:"repo_url"`
	Status        enums.DeploymentStatus `json:"status"`
	AutoDeploy    bool                   `json:"auto_deploy"`
	BuildCommand  string                 `json:"build_command"`
	Branch        string                 `json:"branch"`
	RootDirectory string                 `json:"root"`
	Type          enums.DeploymentType   `json:"type"`
	CreatedAt     time.Time              `gorm:"autoCreateTime;column:created_at"`
	UpdatedAt     time.Time              `gorm:"autoCreateTime;column:updated_at"`
}

type WebServiceDeployment struct {
	DeploymentID uuid.UUID      `gorm:"primaryKey"`
	Deployment   Deployment     `json:"-"`
	RuntimeID    uint           `json:"runtime"`
	Runtime      RuntimeVersion `json:"-"`
}
