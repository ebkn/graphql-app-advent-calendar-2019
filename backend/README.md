# Backend

### Required
- `docker`
- `docker-compose`

## Setup
```sh
$ make
$ make migrate-up
```


## Commands

### start containers
```sh
$ make
```

### start app server
```sh
$ make start
```

### go generate
```sh
$ make generate
```

### migration
```sh
# create
$ FILENAME=<filename> make migrate-create

# up
$ make migrate-up

# down
$ make migrate-down
```
