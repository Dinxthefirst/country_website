import { Country } from "./country.js";
import { fetchCountries } from "./api.js";
import { filterName, filterContinent, filterUNStatus, sortCountries } from "./filters.js";

export const countryList = [];
export const countryMap = new Map();

const searchInput = document.getElementById("search-input");
const filterButtonContainer = document.getElementById("filter-button-container");
const countryContainer = document.getElementById("country-container");

main();

async function main() {
  const countryJson = await fetchCountries();

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

  countryList.sort((a, b) => a.name.localeCompare(b.name));

  countryList.forEach((country) => {
    addCountryToContainer(country);
  });

  searchInput.addEventListener("input", filterName);

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

function createFilterButtons() {
  createSortFilter();
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
  filterButtonContainer.appendChild(continentFilterContainer);

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

function createUNFilter() {
  const unFilterContainer = document.createElement("div");
  unFilterContainer.className = "dropdown";
  filterButtonContainer.appendChild(unFilterContainer);

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

function createSortFilter() {
  const searchContainer = document.getElementById("search-container");

  const sortSearch = document.createElement("div");
  sortSearch.className = "dropdown";
  searchContainer.appendChild(sortSearch);

  const sortButton = document.createElement("button");
  sortButton.id = "sort-button";
  sortButton.className = "dropdown-button";
  sortButton.innerText = "Ascending";
  sortButton.addEventListener("click", openDropdown);
  sortSearch.appendChild(sortButton);

  const dropdownContainer = document.createElement("div");
  dropdownContainer.className = "dropdown-container";
  dropdownContainer.classList.add("hidden");
  sortSearch.appendChild(dropdownContainer);


  const sortOptions = ["Ascending", "Descending"];
  sortOptions.forEach((option) => {
    const optionButton = document.createElement("div");
    optionButton.className = "dropdown-content";
    optionButton.classList.add("hidden");
    optionButton.innerText = option;
    optionButton.addEventListener("click", sortCountries);
    dropdownContainer.appendChild(optionButton);
  });
}