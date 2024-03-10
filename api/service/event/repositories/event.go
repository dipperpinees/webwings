package repositories

import (
	"github.com/dipperpinees/ci/pkg/db"
	"github.com/dipperpinees/ci/pkg/db/models"
)

func CreateEvent(event *models.Events) error {
	return db.GetDB().Create(&event).Error
}

func GetEventsOfDeployment(deploymentID string) (*[]models.Events, error) {
	event := new([]models.Events)
	err := db.GetDB().Find(event).Where("deployment_id = ?", deploymentID).Error
	return event, err
}
