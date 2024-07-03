package utils

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/nlypage/bizkit-education/internal/domain/common/errroz"
	"os"
	"strings"
	"time"
)

var SecretKey = os.Getenv("JWT_SECRET")

func GenerateJwt(uuid string, password string) (string, error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    fmt.Sprintf("%s %s", uuid, password),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})
	return claims.SignedString([]byte(SecretKey))

}

func ParseJwt(cookie string) (string, string, error) {
	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})
	if err != nil || !token.Valid {
		return "", "", err
	}
	claims := token.Claims.(*jwt.StandardClaims)

	issuerSlice := strings.Split(claims.Issuer, " ")
	if len(issuerSlice) != 2 {
		return "", "", errroz.InvalidIssuer
	}
	return issuerSlice[0], issuerSlice[1], nil
}

func GetUUIDByCookie(c *fiber.Ctx) (string, error) {
	cookie := c.Cookies("jwt")
	uuid, _, err := ParseJwt(cookie)
	return uuid, err
}
