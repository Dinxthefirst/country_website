const searchFilterContainer = document.createElement("div");
document.body.appendChild(searchFilterContainer);
searchFilterContainer.id = "search-filter-container";

const searchInput = document.createElement("input");
searchFilterContainer.appendChild(searchInput);
searchInput.id = "search-input";

const filterContainer = document.createElement("div");
searchFilterContainer.appendChild(filterContainer);
filterContainer.id = "filter-container";

const countryContainer = document.createElement("div");
document.body.appendChild(countryContainer);
countryContainer.id = "country-container";
main();

async function main() {
  const countryJson = await getCountriesJson();
  // const countryJson = await getCountriesFromAPI();

  countryJson.sort((a, b) => a.name.common.localeCompare(b.name.common));

  countryJson.forEach((country) => {
    addCountryToContainer(country);
  });

  createSearchInput();
  createFilterButtons();
}

async function getCountriesJson() {
  return await fetch("countries/countries.json").then((response) =>
    response.json()
  );
}

async function getCountriesFromAPI() {
  return fetch("https://restcountries.com/v3.1/all", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  }).then((response) => response.json());
}

function addCountryToContainer(country) {
  const countryDiv = document.createElement("div");
  countryDiv.className = "country";
  countryContainer.appendChild(countryDiv);

  // Add flag
  const flagContainer = document.createElement("div");
  flagContainer.className = "country-flag-container";
  countryDiv.appendChild(flagContainer);
  const flag = document.createElement("img");
  flag.src = country.flags.png;
  flag.alt = country.flags.alt;
  flag.className = "country-flag";
  flagContainer.appendChild(flag);

  // Add country name
  const countryName = document.createElement("div");
  countryName.className = "country-name";
  countryName.innerText = country.name.common;
  countryDiv.appendChild(countryName);

  // Add capital
  const capital = document.createElement("div");
  capital.className = "capital";
  if (country.capital != undefined) {
    if (country.capital.length > 1) {
      capital.innerText = "Capitals: " + country.capital.join(", ");
    } else {
      capital.innerText = "Capital: " + country.capital;
    }
  } else {
    capital.innerText = "No capital";
  }
  countryDiv.appendChild(capital);

  // Add content
  const continent = document.createElement("div");
  continent.className = "continent";
  if (country.continents.length > 1) {
    continent.innerText = "Continents: " + country.continents.join(", ");
  } else {
    continent.innerText = "Continent: " + country.continents;
  }
  countryDiv.appendChild(continent);

  // Add location
  const openStreetMapLink = document.createElement("a");
  openStreetMapLink.className = "open-street-map-link";
  openStreetMapLink.href = country.maps.openStreetMaps;
  openStreetMapLink.innerText = "Location";
  countryDiv.appendChild(openStreetMapLink);
}

function createSearchInput() {
  searchInput.type = "text";
  searchInput.placeholder = "Search";
  searchInput.addEventListener("input", searchForCountry);
}

function searchForCountry() {
  const searchValue = searchInput.value.toLowerCase();
  const countries = document.querySelectorAll(".country");
  countries.forEach((country) => {
    const countryName = country
      .querySelector(".country-name")
      .innerText.toLowerCase();
    if (countryName.includes(searchValue)) {
      country.classList.remove("hidden");
    } else {
      country.classList.add("hidden");
    }
  });
}

function createFilterButtons() {
  const regions = [
    "Africa",
    "North America",
    "South America",
    "Asia",
    "Europe",
    "Oceania",
    "Antarctica",
  ];

  regions.forEach((region) => {
    const filterButton = document.createElement("button");
    filterButton.innerText = region;
    filterButton.className = "filter-button";
    filterButton.addEventListener("click", filterCountries);
    filterContainer.appendChild(filterButton);
  });

  const allButton = document.createElement("button");
  allButton.innerText = "All";
  allButton.className = "filter-button";
  allButton.addEventListener("click", filterCountries);
  filterContainer.appendChild(allButton);
}

function filterCountries(event) {
  const region = event.target.innerText;
  const countries = document.querySelectorAll(".country");
  countries.forEach((country) => {
    if (region === "All") {
      country.classList.remove("hidden");
      return;
    }
    
    const continent = country.querySelector(".continent").innerText;
    if (continent.includes(region)) {
      country.classList.remove("hidden");
    } else {
      country.classList.add("hidden");
    }
  });
}