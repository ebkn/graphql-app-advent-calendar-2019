package model

import (
	v "gopkg.in/go-playground/validator.v9"
)

var validator *v.Validate

func init() {
	validator = v.New()
}
