package dto

type CreateQuestion struct {
	Header   string `json:"header" validate:"required"`
	Body     string `json:"body" validate:"required"`
	Subject  string `json:"subject" validate:"required"`
	Reward   uint   `json:"reward" validate:"required"`
	UserUUID string `json:"-"`
}

type ReturnQuestion struct {
	Header  string `json:"header"`
	Body    string `json:"body"`
	Subject string `json:"subject"`
	Reward  uint   `json:"reward"`
	Author  Author `json:"author"`
}
