package errroz

import "errors"

// Declaring constants for error messages

var (
	InvalidIssuer        = errors.New("invalid issuer")
	TokenExpired         = errors.New("authorization token expired")
	EmptyAuthHeader      = errors.New("auth header is empty")
	InvalidAuthHeader    = errors.New("invalid auth header")
	InvalidSubject       = errors.New("invalid subject")
	NotEnoughCoins       = errors.New("not enough coins")
	QuestionClosed       = errors.New("question is closed")
	NotEnoughPermissions = errors.New("not enough permissions")
	ParsingError         = errors.New("parsing error")
	URLAlreadySet        = errors.New("url already set")
	InvalidSearchMethod  = errors.New("invalid search method")
	InvalidStartTime     = errors.New("invalid start time")
	TransferToYourself   = errors.New("cannot transfer to yourself")
)
