package main

import (
	"log"
	"net/http"
	"server/api"
)

func main() {
	srv := api.NewServer()
	log.Fatal(http.ListenAndServe("127.0.0.1:8080", srv))
}
