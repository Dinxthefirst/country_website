export async function getCountries() {
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
