package auth

import "golang.org/x/crypto/bcrypt"

func GenerateHashedPassword(password string) string {
	hashedByte, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hashedByte)
}

func CheckHashedPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
