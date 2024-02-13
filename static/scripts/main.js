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

