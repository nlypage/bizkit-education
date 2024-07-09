package dto

// CreateUser is a struct that represents a DTO to create a new User.
type CreateUser struct {
	Username string `json:"username" validate:"required,username"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,password"`
}

// AuthUser is a struct that represents a DTO to authenticate a User.
type AuthUser struct {
	Username string `json:"username" validate:"required,username"`
	Password string `json:"password" validate:"required,password"`
}

type Author struct {
	UUID     string `json:"uuid"`
	Username string `json:"username"`
	Rate     string `json:"rate"`
}
