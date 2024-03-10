package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/dipperpinees/ci/pkg/db/models/enums"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type JSON json.RawMessage

func (j *JSON) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New(fmt.Sprint("Failed to unmarshal JSONB value:", value))
	}

	result := json.RawMessage{}
	err := json.Unmarshal(bytes, &result)
	*j = JSON(result)
	return err
}

func (j JSON) Value() (driver.Value, error) {
	if len(j) == 0 {
		return nil, nil
	}
	return json.RawMessage(j).MarshalJSON()
}

type Deployment struct {
	gorm.Model
	ID            uuid.UUID              `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	UserID        uuid.UUID              `json:"user_id" gorm:"uniqueIndex:idx_name_user"`
	User          User                   `json:"-"`
	OAuthID       uuid.UUID              `json:"oauth_id"`
	OAuth         Oauth                  `json:"oauth"`
	Name          string                 `json:"name" gorm:"uniqueIndex:idx_name_user"`
	RepoName      string                 `json:"repo"`
	RepoURL       string                 `json:"repo_url"`
	Status        enums.DeploymentStatus `json:"status"`
	AutoDeploy    bool                   `json:"auto_deploy"`
	BuildCommand  string                 `json:"build_command"`
	Branch        string                 `json:"branch"`
	RootDirectory string                 `json:"root"`
	Type          enums.DeploymentType   `json:"type"`
	Domain        string                 `json:"domain" gorm:"unique"`
	Events        []Events               `json:"event"`
	WebService    WebServiceDeployment   `gorm:"foreignKey:DeploymentID" json:"web_service"`
	CreatedAt     time.Time              `gorm:"autoCreateTime;column:created_at" json:"created_at"`
	UpdatedAt     time.Time              `gorm:"autoCreateTime;column:updated_at" json:"updated_at"`
	EnvVariables  JSON                   `gorm:"type:jsonb;default:'[]'"`
}

type WebServiceDeployment struct {
	DeploymentID uuid.UUID      `gorm:"primaryKey" json:"-"`
	RuntimeID    uint           `json:"runtime"`
	Runtime      RuntimeVersion `json:"-"`
}
