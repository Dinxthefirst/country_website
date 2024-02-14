import { Country } from "./country.js";
const countryList = [];
const countryMap = new Map();

const searchInput = document.getElementById("search-input");
const filterContainer = document.getElementById("filter-container");
const countryContainer = document.getElementById("country-container");

main();

async function main() {
  const countryJson = await getCountries();

  countryJson.forEach((country) => {
    countryList.push(
      new Country(
        country.name.common,
        country.capital,
        country.continents,
        country.flags,
        country.unMember,
        country.maps.openStreetMaps
      )
    );
  });

  countryList.sort();

  countryList.forEach((country) => {
    addCountryToContainer(country);
  });

  createSearchInput();
  createFilterButtons();
}

async function getCountries() {
  try {
    return await getCountriesFromServer();
  } catch (err) {
    console.log(err);
  }
}

async function getCountriesFromServer() {
  const response = await fetch("/countries", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Connection failed with status code ${response.status}`);
  }
  return await response.json();
}

function addCountryToContainer(country) {
  const countryDiv = document.createElement("div");
  countryDiv.className = "country";
  countryContainer.appendChild(countryDiv);
  countryMap.set(country.name, countryDiv);

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
  countryName.innerText = country.name;
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
  createContinentFilter();
  createUNFilter();
}

function toggleDropdown(event) {
  const dropdown = event.target.closest(".dropdown");
  const dropdownContainer = dropdown.querySelector(".dropdown-container");

  dropdownContainer.classList.toggle("hidden");

  for (let i = 0; i < dropdownContainer.children.length; i++) {
    const child = dropdownContainer.children[i];
    child.classList.toggle("hidden");
  }
}

function createContinentFilter() {
  const continentFilterContainer = document.createElement("div");
  continentFilterContainer.className = "dropdown";
  filterContainer.appendChild(continentFilterContainer);

  const continentFilterButton = document.createElement("button");
  continentFilterButton.className = "dropdown-button";
  continentFilterButton.innerText = "Continent";
  continentFilterButton.addEventListener("click", toggleDropdown);
  continentFilterContainer.appendChild(continentFilterButton);

  const dropdownContainer = document.createElement("div");
  dropdownContainer.className = "dropdown-container";
  dropdownContainer.classList.add("hidden");
  continentFilterContainer.appendChild(dropdownContainer);

  const continents = [
    "All",
    "Africa",
    "North America",
    "South America",
    "Asia",
    "Europe",
    "Oceania",
    "Antarctica",
  ];

  continents.forEach((continent) => {
    const continentButton = document.createElement("div");
    continentButton.className = "dropdown-content";
    continentButton.classList.add("hidden");
    continentButton.innerText = continent;
    continentButton.addEventListener("click", filterContinent);
    dropdownContainer.appendChild(continentButton);
  });
}

function filterContinent(event) {
  const region = event.target.innerText;
  if (region === "All") {
    makeAllVisible();
    return;
  }

  countryList.forEach((country) => {
    let isRegion = false;
    country.continents.forEach((continent) => {
      if (continent === region) {
        makeVisible(country.name);
        isRegion = true;
        return;
      }
    });
    if (!isRegion) {
      makeHidden(country.name);
    }
  });
}

function createUNFilter() {
  const unFilterContainer = document.createElement("div");
  unFilterContainer.className = "dropdown";
  filterContainer.appendChild(unFilterContainer);

  const unFilterButton = document.createElement("button");
  unFilterButton.className = "dropdown-button";
  unFilterButton.innerText = "UN";
  unFilterButton.addEventListener("click", toggleDropdown);
  unFilterContainer.appendChild(unFilterButton);

  const dropdownContainer = document.createElement("div");
  dropdownContainer.className = "dropdown-container";
  dropdownContainer.classList.add("hidden");
  unFilterContainer.appendChild(dropdownContainer);

  const unStatus = ["All", "UN Member", "Non-UN Member"];
  unStatus.forEach((status) => {
    const statusButton = document.createElement("div");
    statusButton.className = "dropdown-content";
    statusButton.classList.add("hidden");
    statusButton.innerText = status;
    statusButton.addEventListener("click", filterUNStatus);
    dropdownContainer.appendChild(statusButton);
  });
}

function filterUNStatus(event) {
  const status = event.target.innerText;
  if (status === "All") {
    makeAllVisible();
    return;
  }

  countryList.forEach((country) => {
    if (status === "UN Member" && !country.unStatus) {
      makeHidden(country.name);
    } else if (status === "Non-UN Member" && country.unStatus) {
      makeHidden(country.name);
    } else {
      makeVisible(country.name);
    }
  });
}

function makeHidden(countyName) {
  countryMap.get(countyName).classList.add("hidden");
}

function makeVisible(countryName) {
  countryMap.get(countryName).classList.remove("hidden");
}

function makeAllVisible() {
  countryList.forEach((country) => {
    makeVisible(country.name);
  });
}
