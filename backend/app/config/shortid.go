package config

import (
	"github.com/teris-io/shortid"
)

var sid *shortid.Shortid

func InitShortID() error {
	worker, err := shortid.New(1, shortid.DefaultABC, 2342)
	if err != nil {
		return err
	}

	sid = worker

	return nil
}

func ShortID() *shortid.Shortid {
	return sid
}
