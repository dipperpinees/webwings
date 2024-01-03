package dtos

type SendResetPasswordMailBody struct {
	Email         string `json:"email" validate:"required"`
	RedirectState string `json:"state" validate:"required"`
}

type ResetPasswordBody struct {
	NewPassword string `json:"password" validate:"required"`
	Code        string `json:"code" validate:"required"`
	UserID      string `json:"user" validate:"required"`
}
