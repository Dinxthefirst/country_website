export async function fetchCountries() {
  try {
    return await fetchCountriesFromServer();
  } catch (err) {
    console.log(err);
  }
}

async function fetchCountriesFromServer() {
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
