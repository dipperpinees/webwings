package utils

import (
	"crypto/rand"
	"encoding/base64"
	"math"
)

func GenerateRandomKey(length int) string {
	buff := make([]byte, int(math.Ceil(float64(length)/float64(1.33333333333))))
	rand.Read(buff)
	str := base64.RawURLEncoding.EncodeToString(buff)
	return str[:length]
}
