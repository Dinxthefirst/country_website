import { countryList, countryMap } from "./main.js";

const countryContainer = document.getElementById("country-container");
const activeFiltersContainer = document.getElementById(
  "active-filters-container"
);

const activeFilters = {
  name: "",
  continent: "All",
  unStatus: "All",
  sort: "Ascending",
};

export function filterName(event) {
  const name = event.target.value.toLowerCase();
  activeFilters.name = name;
  applyFilters();
}

export function filterContinent(event) {
  const region = event.target.innerText;
  activeFilters.continent = region;
  applyFilters();
}

export function filterUNStatus(event) {
  const status = event.target.innerText;
  activeFilters.unStatus = status;
  applyFilters();
}

export function sortCountries(event) {
  const sortType = event.target.innerText;

  const searchContainer = document.getElementById("search-container");
  const sortButton = searchContainer.querySelector(".dropdown-button");
  sortButton.innerText = sortType;

  activeFilters.sort = sortType;
  if (sortType === "Ascending") {
    countryList.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    countryList.sort((a, b) => b.name.localeCompare(a.name));
  }

  countryList.forEach((country) => {
    countryContainer.appendChild(countryMap.get(country.name));
  });
  applyFilters();
}

function makeHidden(countyName) {
  countryMap.get(countyName).classList.add("hidden");
}

function makeVisible(countryName) {
  countryMap.get(countryName).classList.remove("hidden");
}

function applyFilters() {
  countryList.forEach((country) => {
    let isVisible = true;

    if (activeFilters.name !== "") {
      if (!country.name.toLowerCase().includes(activeFilters.name)) {
        isVisible = false;
      }
    }

    if (
      activeFilters.continent !== "All" &&
      !country.continents.includes(activeFilters.continent)
    ) {
      isVisible = false;
    }

    if (activeFilters.unStatus !== "All") {
      if (
        (activeFilters.unStatus === "UN Member" && !country.unStatus) ||
        (activeFilters.unStatus === "Non-UN Member" && country.unStatus)
      ) {
        isVisible = false;
      }
    }

    if (isVisible) {
      makeVisible(country.name);
    } else {
      makeHidden(country.name);
    }
  });

  updateActiveFilters();
}

function updateActiveFilters() {
  activeFiltersContainer.innerText =
    activeFilters.continent +
    " " +
    activeFilters.unStatus;
}
