package dtos

type CurrentRuntimeParams struct {
	Language string `param:"language" validate:"required"`
}

type CurrentRuntimeResponse struct {
	Runtime string `json:"runtime"`
}
