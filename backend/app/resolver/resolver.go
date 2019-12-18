//go:generate go run github.com/99designs/gqlgen

package resolver

import (
	"app/config"
	"app/model"
	"context"
	"errors"
)

type Resolver struct{}

type queryResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }

func New() *Resolver {
	return &Resolver{}
}

func (r *Resolver) Mutation() MutationResolver {
	return &mutationResolver{r}
}

func (r *Resolver) Query() QueryResolver {
	return &queryResolver{r}
}

func (r *queryResolver) Tasks(ctx context.Context, input model.TasksInput, orderBy model.TaskOrderFields, page model.PaginationInput) (*model.TaskConnection, error) {
	db := config.DB()

	if input.Completed != nil {
		db = db.Where("completed = ?", *input.Completed)
	}

	var err error

	switch orderBy {
	case model.TaskOrderFieldsLatest:
		db, err = pageDB(db, "id", desc, page)
		if err != nil {
			return &model.TaskConnection{PageInfo: &model.PageInfo{}}, err
		}

		var tasks []*model.Task
		if err := db.Find(&tasks).Error; err != nil {
			return &model.TaskConnection{PageInfo: &model.PageInfo{}}, err
		}

		return convertToConnection(tasks, orderBy, page), nil
	case model.TaskOrderFieldsDue:
		db, err = pageDB(db, "UNIX_TIMESTAMP(due)", desc, page)
		if err != nil {
			return &model.TaskConnection{PageInfo: &model.PageInfo{}}, err
		}

		var tasks []*model.Task
		if err := db.Find(&tasks).Error; err != nil {
			return &model.TaskConnection{PageInfo: &model.PageInfo{}}, err
		}

		return convertToConnection(tasks, orderBy, page), nil
	default:
		return &model.TaskConnection{PageInfo: &model.PageInfo{}}, errors.New("invalid order by")
	}
}

func (r *mutationResolver) CreateTask(ctx context.Context, input model.CreateTaskInput) (*model.Task, error) {
	db := config.DB()

	id, err := config.ShortID().Generate()
	if err != nil {
		return &model.Task{}, err
	}

	task := model.Task{
		Identifier: id,
		Title:      input.Title,
		Due:        input.Due,
	}
	if input.Notes != nil {
		task.Notes = *input.Notes
	}
	if input.Completed != nil {
		task.Completed = *input.Completed
	}

	if err := db.Debug().Create(&task).Error; err != nil {
		return &model.Task{}, err
	}

	return &task, nil
}

func (r *mutationResolver) UpdateTask(ctx context.Context, input model.UpdateTaskInput) (*model.Task, error) {
	db := config.DB()

	var task model.Task
	if err := db.Where("identifier = ?", input.TaskID).First(&task).Error; err != nil {
		return &model.Task{}, err
	}

	params := map[string]interface{}{}
	if input.Title != nil {
		params["title"] = *input.Title
	}
	if input.Notes != nil {
		params["notes"] = *input.Notes
	}
	if input.Completed != nil {
		params["completed"] = *input.Completed
	}
	if input.Due == nil {
		params["due"] = nil
	} else {
		params["due"] = *input.Due
	}

	if err := db.Model(&task).Updates(params).Error; err != nil {
		return &model.Task{}, err
	}

	return &task, nil
}
