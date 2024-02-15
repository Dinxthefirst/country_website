import { countryList, countryMap } from "./main.js";

const countryContainer = document.getElementById("country-container");
const activeFiltersContainer = document.getElementById(
  "active-filters-container"
);

const activeFilters = {
  name: "",
  continents: [],
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
  if (activeFilters.continents.includes(region)) {
    return;
  }
  activeFilters.continents.push(region);
  activeFiltersContainer.appendChild(createContinentFilterContainer(region))
  applyFilters();
}

function createContinentFilterContainer(region) {
  const filterContainer = document.createElement("div");
  filterContainer.className = "active-filter";
  filterContainer.innerText = region;

  const removeFilterButton = document.createElement("div");
  removeFilterButton.className = "remove-filter-button";
  removeFilterButton.innerText = "x";
  removeFilterButton.addEventListener("click", removeFilter);
  filterContainer.appendChild(removeFilterButton);

  return filterContainer;
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

    if (activeFilters.continents.length > 0)  {
      isVisible = activeFilters.continents.some((continent) => country.continents.includes(continent));
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
}

function removeFilter(event) {
  const parentElement = event.target.parentElement;
  const filterType = parentElement.textContent.replace(event.target.textContent, "");

  activeFilters.continents = activeFilters.continents.filter(
    (continent) => continent !== filterType
  );

  parentElement.remove();

  applyFilters();
}

// function updateActiveFilters() {
//   activeFiltersContainer.innerText =
//     // activeFilters.continents +
//     // " " +
//     activeFilters.unStatus;
// }
