package repositories

import (
	"github.com/dipperpinees/ci/pkg/db"
	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/google/uuid"
)

func CreateOAuth(oauth *models.Oauth) error {
	return db.GetDB().Create(oauth).Error
}

func GetOAuthByID(id uuid.UUID) (*models.Oauth, error) {
	currentOAuth := new(models.Oauth)
	err := db.GetDB().Where("id = ?", id).First(&currentOAuth).Error
	return currentOAuth, err
}

func GetUniqueOAuth(username string, userID uuid.UUID) (*models.Oauth, error) {
	currentOAuth := new(models.Oauth)
	err := db.GetDB().Where("git_username = ?", username).Where("user_id = ?", userID).First(&currentOAuth).Error
	return currentOAuth, err
}

func GetUserOAuths(userID uuid.UUID) (*[]models.Oauth, error) {
	oauthData := new([]models.Oauth)
	err := db.GetDB().Where("user_id = ?", userID).Find(oauthData).Error
	return oauthData, err
}
