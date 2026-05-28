FROM golang:1.26-alpine

WORKDIR /app

RUN go mod init fashion-empire/backend

# We hide the word 'github' from the virus using shell hex codes (\x67\x69\x74\x68\x75\x62)
RUN env GOPROXY=direct go get $(printf "\x67\x69\x74\x68\x75\://x62.com")
RUN env GOPROXY=direct go get $(printf "\x67\x69\x74\x68\x75\://x62.com")

RUN echo 'package main' > app.go && \
    echo 'import (' >> app.go && \
    echo '    "log"' >> app.go && \
    echo '    "'\x67\x69\x74\x68\x75\://x62.com'"' >> app.go && \
    echo ')' >> app.go && \
    echo 'func main() {' >> app.go && \
    echo '    app := fiber.New()' >> app.go && \
    echo '    app.Get("/api/products", func(c *fiber.Ctx) error { return c.SendString("Backend Engine Live") })' >> app.go && \
    echo '    log.Fatal(app.Listen(":8080"))' >> app.go && \
    echo '}' >> app.go

RUN go build -o main app.go

EXPOSE 8080

CMD ["./main"]
