package main

import (
	"net/http"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	elog "github.com/labstack/gommon/log"
)

func main() {
	e := echo.New()

	e.Use(middleware.Recover())
	e.Use(middleware.Logger())
	e.Use(middleware.Gzip())

	e.GET("/health", func(c echo.Context) error {
		return c.NoContent(http.StatusOK)
	})

	e.Logger.SetLevel(elog.INFO)
	e.HideBanner = true
	e.Logger.Fatal(e.Start(":3000"))
}
