package models

import (
	"time"

	enums "github.com/dipperpinees/ci/pkg/db/models/enums"
	"github.com/google/uuid"
)

type Deployment struct {
	ID            uuid.UUID `gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	UserID        uuid.UUID
	User          User
	OAuthID       uuid.UUID
	OAuth         Oauth
	Name          string
	RepoName      string
	RepoURL       string
	RuntimeID     uint
	Runtime       RuntimeVersion
	Status        enums.DeploymentStatus
	AutoDeploy    bool
	BuildCommand  string
	Branch        string
	RootDirectory string
	Type          enums.DeploymentType
	CreatedAt     time.Time `gorm:"autoCreateTime;column:created_at"`
	UpdatedAt     time.Time `gorm:"autoCreateTime;column:updated_at"`
}
