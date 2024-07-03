package errroz

import "errors"

// Declaring constants for error messages

var (
	InvalidIssuer = errors.New("invalid issuer")
	TokenExpired  = errors.New("authorization token expired")
)
