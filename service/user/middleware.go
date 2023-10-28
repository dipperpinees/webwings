package user

import (
	"net/http"

	"github.com/dipperpinees/ci/pkg/auth"
	"github.com/dipperpinees/ci/pkg/db"
	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/labstack/echo/v4"
)

func InitAuthMiddleware() func(next echo.HandlerFunc) echo.HandlerFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			token := c.Request().Header.Get(("Authorization"))
			data, err := auth.DecodeJWT(token)
			if err != nil {
				return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
			}
			user := new(models.User)
			if err := db.GetDB().Where("id = ?", data["id"]).First(user).Error; err != nil {
				return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
			}
			c.Set("user", user)
			return next(c)
		}
	}
}
