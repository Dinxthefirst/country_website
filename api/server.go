package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

type Name struct {
	Common string `json:"common"`
}

type Flag struct {
	Png string `json:"png"`
	Svg string `json:"svg"`
	Alt string `json:"alt"`
}

type Map struct {
	OpenStreetMaps string `json:"openStreetMaps"`
}

type Country struct {
	Name      Name     `json:"name"`
	Continent []string `json:"continents"`
	Flag      Flag     `json:"flags"`
	Capital   []string `json:"capital"`
	Location  Map      `json:"maps"`
}

type Server struct {
	*mux.Router

	Countries []Country
}

func NewServer() *Server {
	s := &Server{
		Router:    mux.NewRouter(),
		Countries: getCountries(),
	}

	s.routes()

	s.PathPrefix("/static/styles/").Handler(http.StripPrefix("/static/styles/", http.FileServer(http.Dir("./static/styles/"))))
	s.PathPrefix("/static/scripts/").Handler(http.StripPrefix("/static/scripts/", http.FileServer(http.Dir("./static/scripts/"))))

	return s
}

func (s *Server) routes() {
	s.HandleFunc("/", s.appHandler())
	s.HandleFunc("/countries", s.getCountriesHandler()).Methods("GET")
}

func (s *Server) appHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		http.ServeFile(w, req, "static/index.html")
	}
}

func (s *Server) getCountriesHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(s.Countries)
	}
}

func getCountries() []Country {
	var countriesData []byte

	countriesData, err := os.ReadFile("./countries/countries.json")
	if err != nil {
		fmt.Println(err)
		return nil
	}

	var countries []Country
	err = json.Unmarshal(countriesData, &countries)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	return countries
}
