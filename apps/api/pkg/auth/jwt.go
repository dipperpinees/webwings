package auth

import (
	"errors"
	"fmt"
	"time"

	"github.com/dipperpinees/ci/configs"
	"github.com/golang-jwt/jwt"
)

func GenerateJWT(data map[string]interface{}, expTime time.Duration) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	for key, value := range data {
		claims[key] = value
	}
	if expTime != 0 {
		claims["exp"] = time.Now().Add(expTime).Unix()
	}
	tokenString, err := token.SignedString([]byte(configs.GetConfigs().JWT_SECRET_KEY))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func DecodeJWT(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("failed parse token")
		}
		return []byte(configs.GetConfigs().JWT_SECRET_KEY), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("failed decode token ")
}
