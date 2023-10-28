package dtos

type CurrentRuntimeParams struct {
	Language string `param:"language" validate:"required"`
}
