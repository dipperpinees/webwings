package repositories

import (
	"github.com/dipperpinees/ci/pkg/db"
	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/google/uuid"
)

func CreateUser(newUser *models.User) error {
	return db.GetDB().Create(&newUser).Error
}

func FindOneOrCreateUser(user *models.User) error {
	return db.GetDB().FirstOrCreate(&user, models.User{Email: user.Email}).Error
}

func GetUserByEmail(email string) (*models.User, error) {
	currentUser := new(models.User)
	err := db.GetDB().Where("email = ?", email).First(currentUser).Error
	return currentUser, err
}

func GetUserByID(id uuid.UUID) (*models.User, error) {
	currentUser := new(models.User)
	err := db.GetDB().Where("id = ?", id).First(currentUser).Error
	return currentUser, err
}

func GetSessionByRefreshToken(refreshToken string) (*models.Session, error) {
	currentSession := new(models.Session)
	err := db.GetDB().Preload("User").Where("refresh_token = ?", refreshToken).Where("active = ?", true).First(currentSession).Error
	return currentSession, err
}

func DisableSessionByRefreshToken(refreshToken string) error {
	return db.GetDB().Model(&models.Session{}).Where("refresh_token = ?", refreshToken).Update("active", false).Error
}

func CreateSession(session *models.Session) error {
	return db.GetDB().Create(session).Error
}

func UpdateUser(user *models.User) error {
	return db.GetDB().Save(user).Error
}
