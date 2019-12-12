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

type cursorResource struct {
	Name string
	ID   int
}

func createCursor(first cursorResource, second *cursorResource) string {
	var cursor []byte
	if second != nil {
		cursor = []byte(fmt.Sprintf("%s:%d:%s:%d", first.Name, first.ID, second.Name, second.ID))
	} else {
		cursor = []byte(fmt.Sprintf("%s:%d", first.Name, first.ID))
	}

	return base64.StdEncoding.EncodeToString(cursor)
}

func decodeCursor(cursor string) (cursorResource, *cursorResource, error) {
	bytes, err := base64.StdEncoding.DecodeString(cursor)
	if err != nil {
		return cursorResource{}, nil, err
	}

	vals := strings.Split(string(bytes), ":")

	switch len(vals) {
	case 2:
		id, err := strconv.Atoi(vals[1])
		if err != nil {
			return cursorResource{}, nil, errors.New("invalid_cursor")
		}

		return cursorResource{Name: vals[0], ID: id}, nil, nil
	case 4:
		id, err := strconv.Atoi(vals[1])
		if err != nil {
			return cursorResource{}, nil, errors.New("invalid_cursor")
		}

		id2, err := strconv.Atoi(vals[3])
		if err != nil {
			return cursorResource{}, nil, errors.New("invalid_cursor")
		}

		return cursorResource{
				Name: vals[0],
				ID:   id,
			}, &cursorResource{
				Name: vals[2],
				ID:   id2,
			}, nil
	default:
		return cursorResource{}, nil, errors.New("invalid_cursor")
	}
}

func convertToConnection(tasks []*model.Task, orderBy model.TaskOrderFields, page model.PaginationInput) *model.TaskConnection {
	if len(tasks) == 0 {
		return &model.TaskConnection{PageInfo: &model.PageInfo{}}
	}

	pageInfo := model.PageInfo{}
	if page.First != nil {
		if len(tasks) >= *page.First+1 {
			pageInfo.HasNextPage = true
			tasks = tasks[:len(tasks)-1]
		}
	}

	switch orderBy {
	case model.TaskOrderFieldsLatest:
		taskEdges := make([]*model.TaskEdge, len(tasks))

		for i, task := range tasks {
			cursor := createCursor(
				cursorResource{Name: "task", ID: task.ID},
				nil,
			)
			taskEdges[i] = &model.TaskEdge{
				Cursor: cursor,
				Node:   task,
			}
		}

		pageInfo.EndCursor = taskEdges[len(taskEdges)-1].Cursor

		return &model.TaskConnection{PageInfo: &pageInfo, Edges: taskEdges}
	case model.TaskOrderFieldsDue:
		taskEdges := make([]*model.TaskEdge, 0, len(tasks))

		for _, task := range tasks {
			if task.Due == nil {
				pageInfo.HasNextPage = false
				return &model.TaskConnection{PageInfo: &pageInfo, Edges: taskEdges}
			}

			cursor := createCursor(
				cursorResource{Name: "task", ID: int(task.Due.Unix())},
				&cursorResource{Name: "due", ID: task.ID},
			)

			taskEdges = append(taskEdges, &model.TaskEdge{
				Cursor: cursor,
				Node:   task,
			})
		}

		pageInfo.EndCursor = taskEdges[len(taskEdges)-1].Cursor

		return &model.TaskConnection{PageInfo: &pageInfo, Edges: taskEdges}
	}

	return &model.TaskConnection{PageInfo: &model.PageInfo{}}
}
