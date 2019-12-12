package resolver

import (
	"app/model"
	"context"
)

type taskResolver struct{ *Resolver }

func (r *Resolver) Task() TaskResolver {
	return &taskResolver{r}
}

func (r *taskResolver) ID(ctx context.Context, obj *model.Task) (string, error) {
	panic("not implemented")
}
