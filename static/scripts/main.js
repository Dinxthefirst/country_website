const countryContainer = document.createElement("div");
main();

async function main() {
  const countryJson = await getCountriesJson();
  // const countryJson = await getCountriesFromAPI();

  countryJson.sort((a, b) => a.name.common.localeCompare(b.name.common));

  
  countryContainer.id = "country-container";

  // displayCountryNames(countryNames);
  displayCountryFlags(countryJson);
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

function displayCountryNames(countryNames) {
  const countriesList = document.createElement("ul");
  document.body.appendChild(countriesList);
  countryNames.forEach((country) => {
    const listItem = document.createElement("li");
    listItem.textContent = country;
    countriesList.appendChild(listItem);
  });
}

function displayCountryFlags(countryJson) {
  document.body.appendChild(countryContainer);
  countryJson.forEach((country) => {
    const listItem = document.createElement("li");
    const flag = document.createElement("img");
    flag.src = country.flags.svg;
    listItem.appendChild(flag);
    countryContainer.appendChild(listItem);
  });
}
