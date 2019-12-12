DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=graphql-app-development
DB_CONN=mysql://${DB_USER}:${DB_PASSWORD}@tcp\(${DB_HOST}:${DB_PORT}\)/${DB_NAME}

.PHONY: run
run:
	docker-compose up --build -d

.PHONY: start
start:
	docker-compose exec app realize start --run

.PHONY: migrate-up
migrate-up:
	docker-compose exec app migrate --source file://migrations --database ${DB_CONN} up

.PHONY: migrate-down
migrate-down:
	docker-compose exec app migrate --source file://migrations --database ${DB_CONN} down 1
