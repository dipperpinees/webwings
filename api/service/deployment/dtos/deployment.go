package dtos

import (
	"github.com/dipperpinees/ci/pkg/db/models/enums"
	"github.com/google/uuid"
)

type CreateDeploymentBody struct {
	Type          enums.DeploymentType `json:"type" validate:"required"`
	OAuthID       uuid.UUID            `json:"oauth" validate:"required"`
	RepoName      string               `json:"repo" validate:"required"`
	RepoURL       string               `json:"repo_url" validate:"required"`
	RuntimeID     uint                 `json:"runtime" validate:"required"`
	AutoDeploy    bool                 `json:"auto_deploy" validate:"required"`
	BuildCommand  string               `json:"build_command" validate:"required"`
	Branch        string               `json:"branch" validate:"required"`
	RootDirectory string               `json:"root" validate:"required"`
}
