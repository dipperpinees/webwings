package models

import (
	"time"

	enums "github.com/dipperpinees/ci/pkg/db/models/enums"
	"github.com/google/uuid"
)

type Deployment struct {
	ID            uuid.UUID              `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	UserID        uuid.UUID              `json:"user_id" sql:"unique_index:idx_user_name"`
	User          User                   `json:"-"`
	OAuthID       uuid.UUID              `json:"oauth_id"`
	OAuth         Oauth                  `json:"oauth"`
	Name          string                 `json:"name" sql:"unique_index:idx_user_name"`
	RepoName      string                 `json:"repo"`
	RepoURL       string                 `json:"repo_url"`
	Status        enums.DeploymentStatus `json:"status"`
	AutoDeploy    bool                   `json:"auto_deploy"`
	BuildCommand  string                 `json:"build_command"`
	Branch        string                 `json:"branch"`
	RootDirectory string                 `json:"root"`
	Type          enums.DeploymentType   `json:"type"`
	WebService    WebServiceDeployment   `gorm:"foreignKey:DeploymentID" json:"web_service"`
	CreatedAt     time.Time              `gorm:"autoCreateTime;column:created_at" json:"created_at"`
	UpdatedAt     time.Time              `gorm:"autoCreateTime;column:updated_at" json:"updated_at"`
}

type WebServiceDeployment struct {
	DeploymentID uuid.UUID      `gorm:"primaryKey" json:"-"`
	RuntimeID    uint           `json:"runtime"`
	Runtime      RuntimeVersion `json:"-"`
}
