package dtos

type BranchQueryParams struct {
	Username string `param:"user" validate:"required"`
	Repo     string `param:"repo" validate:"required"`
}
