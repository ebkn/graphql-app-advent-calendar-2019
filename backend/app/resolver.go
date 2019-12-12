//go:generate go run github.com/99designs/gqlgen

package main

import "context"

type Resolver struct{}

type queryResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }

func (r *Resolver) Mutation() MutationResolver {
	return &mutationResolver{r}
}

func (r *Resolver) Query() QueryResolver {
	return &queryResolver{r}
}

func (r *queryResolver) Tasks(ctx context.Context, input TasksInput, orderBy TaskOrderFields, page PaginationInput) (*TaskConnection, error) {
	panic("not implemented")
}

func (r *mutationResolver) CreateTask(ctx context.Context, input CreateTaskInput) (*Task, error) {
	panic("not implemented")
}
func (r *mutationResolver) UpdateTask(ctx context.Context, input UpdateTaskInput) (*Task, error) {
	panic("not implemented")
}
