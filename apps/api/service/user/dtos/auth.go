package dtos

import "github.com/dipperpinees/ci/pkg/db/models"

type SignUpBody struct {
	Name     string `json:"name"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type SignInBody struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type AuthResponse struct {
	models.User
	AccessToken string `json:"accessToken"`
}

type UserGoogleInput struct {
	AccessToken string `json:"access_token" binding:"required"`
	AuthUser    string `json:"authuser"`
	ExpiresIn   string `json:"prompt"`
	Scope       string `json:"scope"`
	TokenType   string `json:"bearer"`
}
