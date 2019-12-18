package model

import "time"

type Task struct {
	ID         int
	Identifier string `validate:"required,max=255"`
	Title      string `validate:"required,max=255"`
	Notes      string `validate:"omitempty,max=65535"`
	Completed  bool
	Due        *time.Time
	CreatedAt  time.Time
	UpdatedAt  time.Time
	DeletedAt  *time.Time
}

func (Task) IsNode() {}

func (t *Task) BeforeSave() error {
	return validator.Struct(t)
}
