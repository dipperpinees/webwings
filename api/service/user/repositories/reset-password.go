package repositories

import (
	"time"

	"github.com/dipperpinees/ci/pkg/db"
	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/google/uuid"
)

func DisableOldUserCode(userID uuid.UUID) error {
	return db.GetDB().Where("user_id = ?", userID).Model(&models.ResetPassword{}).Error
}

func CreateResetPassword(data *models.ResetPassword) error {
	return db.GetDB().Create(data).Error
}

func UpdateResetPassword(data *models.ResetPassword) error {
	return db.GetDB().Save(data).Error
}

func GetActiveResetPassword(code string, userID uuid.UUID) (*models.ResetPassword, error) {
	currentCodeData := new(models.ResetPassword)
	err := db.
		GetDB().
		Where("secret_key = ?", code).
		Where("active = ?", true).
		Where("user_id = ?", userID.String()).
		Where("created_at >= ?", time.Now().Add(-10*time.Minute)).
		First(currentCodeData).
		Error
	return currentCodeData, err
}
