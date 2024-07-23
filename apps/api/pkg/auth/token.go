package auth

import (
	"crypto/sha256"
	"encoding/hex"
	"strconv"
	"time"

	"github.com/dipperpinees/ci/pkg/utils"
	"github.com/google/uuid"
)

func GenerateRefreshToken(userID uuid.UUID) string {
	nonceBytes := []byte(utils.RandomString(12))

	timestamps := strconv.FormatInt(time.Now().UnixNano(), 10)
	combinedData := []byte(userID.String() + hex.EncodeToString([]byte(nonceBytes)) + timestamps)
	h := sha256.New()
	h.Write(combinedData)
	refreshToken := hex.EncodeToString(h.Sum(nil))

	return refreshToken
}
