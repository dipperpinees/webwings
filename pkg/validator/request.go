package validator

import (
	"net/http"

	_validator "github.com/go-playground/validator"
	"github.com/labstack/echo/v4"
)

type CustomValidator struct {
	Validator *_validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	if err := cv.Validator.Struct(i); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return nil
}
