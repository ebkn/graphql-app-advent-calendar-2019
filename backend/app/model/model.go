package model

import (
	"time"

	v "gopkg.in/go-playground/validator.v9"
)

var validator *v.Validate

func init() {
	validator = v.New()
}

type Task struct {
	ID         int
	Identifier string `validate:"required,max=255"`
	Title      string `validate:"required,max=255"`
	Notes      string `validate:"max=65535"`
	Completed  *bool  `gorm:"default:false"`
	Due        *time.Time
	CreatedAt  time.Time
	UpdatedAt  time.Time
	DeletedAt  *time.Time
}

func (Task) IsNode() {}

func (t *Task) BeforeSave() error {
	return validator.Struct(t)
}
