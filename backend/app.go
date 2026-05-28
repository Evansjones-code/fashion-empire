package main

import (
	"log"

	"://github.com"
)

func main() {
	app := fiber.New()

	app.Get("/api/products", func(c *fiber.Ctx) error {
		return c.SendString("Backend Engine Live")
	})

	log.Fatal(app.Listen(":8080"))
}
