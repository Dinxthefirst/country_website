export function searchForCountry() {
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
