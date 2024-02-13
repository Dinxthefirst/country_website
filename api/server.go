package api

import (
	"net/http"

	"github.com/gorilla/mux"
)

type Server struct {
	*mux.Router
}

func NewServer() *Server {
	s := &Server{
		Router: mux.NewRouter(),
	}

	s.routes()

	// Serve static files
	s.PathPrefix("/static/styles/").Handler(http.StripPrefix("/static/styles/", http.FileServer(http.Dir("./static/styles/"))))
	s.PathPrefix("/static/scripts/").Handler(http.StripPrefix("/static/scripts/", http.FileServer(http.Dir("./static/scripts/"))))

	return s
}

func (s *Server) routes() {
	s.HandleFunc("/", s.appHandler())
}

func (s *Server) appHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		http.ServeFile(w, req, "static/index.html")
	}
}
