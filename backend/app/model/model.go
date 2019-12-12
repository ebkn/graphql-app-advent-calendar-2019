package model

import "time"

type Task struct {
	ID         int64
	Identifier string
	Title      string
	Notes      string
	Completed  bool
	Due        time.Time
	CreatedAt  time.Time
	UpdatedAt  time.Time
	DeletedAt  *time.Time
}

func (Task) IsNode() {}
