FROM golang:1.13.4-alpine3.10 as build

WORKDIR /app

RUN apk update --no-cache \
  && apk add --no-cache \
    git

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN GOOS=linux GOARCH=amd64 go build -o app main.go
RUN GO111MODULE=off go get github.com/oxequa/realize


FROM alpine:3.10

WORKDIR /app

COPY --from=build /app/app .

EXPOSE 3000

CMD ["./app"]
