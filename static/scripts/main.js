import { Country } from "./country.js";
import { getCountries } from "./api.js";

const countryList = [];
const countryMap = new Map();

const searchInput = document.getElementById("search-input");
const filterContainer = document.getElementById("filter-container");
const countryContainer = document.getElementById("country-container");

main();

async function main() {
  const countryJson = await getCountries();

  countryJson.forEach((country) => {
    console.log(country.maps.openStreetMaps);
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

  countryList.forEach((country) => {
    addCountryToContainer(country);
  });

  searchInput.addEventListener("input", searchForCountry);
  createFilterButtons();
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
  openStreetMapLink.href = country.maps;
  openStreetMapLink.innerText = "Location";
  countryDiv.appendChild(openStreetMapLink);
}

function searchForCountry(event) {
  const searchValue = event.target.value.toLowerCase();
  countryList.forEach((country) => {
    const countryName = country.name.toLowerCase();
    if (countryName.includes(searchValue)) {
      makeVisible(country.name);
    } else {
      makeHidden(country.name);
    }
  });
}

function createFilterButtons() {
  createContinentFilter();
  createUNFilter();
}

function openDropdown(event) {
  closeDropdowns();
  const dropdown = event.target.closest(".dropdown");
  const dropdownContainer = dropdown.querySelector(".dropdown-container");

  dropdownContainer.classList.remove("hidden");

  for (let i = 0; i < dropdownContainer.children.length; i++) {
    const child = dropdownContainer.children[i];
    child.classList.remove("hidden");
  }

  event.stopPropagation();
  document.addEventListener("click", closeDropdowns);
}

function closeDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown-container");
  dropdowns.forEach((dropdown) => {
    dropdown.classList.add("hidden");
    for (let i = 0; i < dropdown.children.length; i++) {
      const child = dropdown.children[i];
      child.classList.add("hidden");
    }
  });

  document.removeEventListener("click", closeDropdowns);
}

function createContinentFilter() {
  const continentFilterContainer = document.createElement("div");
  continentFilterContainer.className = "dropdown";
  filterContainer.appendChild(continentFilterContainer);

  const continentFilterButton = document.createElement("button");
  continentFilterButton.className = "dropdown-button";
  continentFilterButton.innerText = "Continent";
  continentFilterButton.addEventListener("click", openDropdown);
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
  unFilterButton.addEventListener("click", openDropdown);
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
