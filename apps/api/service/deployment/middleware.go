package deployment

import (
	"net/http"

	"github.com/dipperpinees/ci/pkg/db"
	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/labstack/echo/v4"
)

func InitDeploymentPolicyMiddleware() func(next echo.HandlerFunc) echo.HandlerFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			user, _ := c.Get("user").(*models.User)
			deploymentID := c.Param("id")
			currentDeployment := new(models.Deployment)
			if err := db.GetDB().Where("id = ?", deploymentID).First(currentDeployment).Error; err != nil {
				return echo.NewHTTPError(http.StatusBadRequest, err.Error())
			}
			if user.ID.String() != currentDeployment.UserID.String() {
				return echo.NewHTTPError(http.StatusUnauthorized, "")
			}
			return next(c)
		}
	}
}
