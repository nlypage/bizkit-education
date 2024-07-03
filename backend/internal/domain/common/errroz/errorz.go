package errroz

import "errors"

// Declaring constants for error messages

var (
	InvalidIssuer     = errors.New("invalid issuer")
	TokenExpired      = errors.New("authorization token expired")
	EmptyAuthHeader   = errors.New("auth header is empty")
	InvalidAuthHeader = errors.New("invalid auth header")
	InvalidSubject    = errors.New("invalid subject")
	NotEnoughCoins    = errors.New("not enough coins")
)
