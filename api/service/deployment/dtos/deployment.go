package dtos

import (
	"github.com/dipperpinees/ci/pkg/db/models/enums"
	"github.com/google/uuid"
)

type CreateDeploymentBody struct {
	Name          string               `json:"name" validate:"required"`
	Type          enums.DeploymentType `json:"type" validate:"required"`
	OAuthID       uuid.UUID            `json:"oauth_id" validate:"required"`
	RepoName      string               `json:"repo" validate:"required"`
	RepoURL       string               `json:"repo_url" validate:"required"`
	RuntimeID     uint                 `json:"runtime"`
	AutoDeploy    bool                 `json:"auto_deploy" validate:"required"`
	BuildCommand  string               `json:"build_command"`
	StartCommand  string               `json:"start_command"`
	Branch        string               `json:"branch" validate:"required"`
	RootDirectory string               `json:"root"`
	EnvVariables  string               `json:"env_variables"`
}

type GetDeploymentParams struct {
	ID string `param:"id"`
}
