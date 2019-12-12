package resolver

import (
	"app/model"
	"encoding/base64"
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/jinzhu/gorm"
)

type direction string

var (
	asc  direction = "asc"
	desc direction = "desc"
)

func pageDB(db *gorm.DB, col string, dir direction, page model.PaginationInput) (*gorm.DB, error) {
	var limit int
	if page.First == nil {
		limit = 11
	} else {
		limit = *page.First + 1
	}

	if page.After != nil {
		id, pKey, err := decodeCursor(*page.After)
		if err != nil {
			return db, err
		}

		if pKey != nil {
			switch dir {
			case asc:
				db = db.Where(gorm.Expr(
					"(? > ?) OR (? = ? AND id > ?)",
					col, id,
					col, id, *pKey,
				))
			case desc:
				db = db.Where(gorm.Expr(
					"(? > ?) OR (? = ? AND id > ?)",
					col, id,
					col, id, *pKey,
				))
			}
		} else {
			switch dir {
			case asc:
				db = db.Where(gorm.Expr("? > ?", col, id))
			case desc:
				db = db.Where(gorm.Expr("? < ?", col, id))
			}
		}
	}

	switch dir {
	case asc:
		db = db.Order(gorm.Expr("? ASC, id ASC", col))
	case desc:
		db = db.Order(gorm.Expr("? DESC, id DESC", col))
	}

	return db.Limit(limit), nil
}

func createCursor(resource string, id int, pKey *uint64) string {
	var cursor []byte
	if pKey != nil {
		cursor = []byte(fmt.Sprintf("%s:%d:%d", resource, id, *pKey))
	} else {
		cursor = []byte(fmt.Sprintf("%s:%d", resource, id))
	}

	return base64.StdEncoding.EncodeToString(cursor)
}

func decodeCursor(cursor string) (id string, pKey *int, err error) {
	bytes, err := base64.StdEncoding.DecodeString(cursor)
	if err != nil {
		return "", nil, err
	}

	vals := strings.Split(string(bytes), ":")

	switch len(vals) {
	case 2:
		return vals[1], nil, nil
	case 3:
		pKey, err := strconv.Atoi(vals[2])
		if err != nil {
			return "", nil, errors.New("invalid_cursor")
		}

		return vals[1], &pKey, nil
	default:
		return "", nil, errors.New("invalid_cursor")
	}
}
