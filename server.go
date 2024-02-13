package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

func main() {

	r := mux.NewRouter()

	r.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
		http.ServeFile(w, req, "client/index.html")
	})

	r.PathPrefix("/").Handler(http.FileServer(http.Dir("client/styles")))
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("client/scripts")))

	srv := &http.Server{
		Handler:      r,
		Addr:         "127.0.0.1:8888",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
