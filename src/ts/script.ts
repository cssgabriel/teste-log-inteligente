import { URL_BASE } from "./config.js";
import Dashboard from "./Dashboard.js";
import getData from "./getData.js";
import { normalizeCountriesAPI } from "./normalizeDataAPI.js";
import Suggestions from "./Suggestions.js";

const headerSection = document.querySelector<HTMLElement>(".header-section");
const form = document.forms[0];
const inputSearch = form.querySelector<HTMLInputElement>("#search");

interface state {
  // queries: string[];
  queries: [string, Country[]];
  countries: Country[];
}

const state: state = {
  queries: ["", []],
  countries: [],
};

headerSection?.addEventListener("click", function (e: Event) {
  if (e.target instanceof HTMLElement) {
    if (e.target.closest(".search-container")) {
      const container = e.target.closest(".search-container");
      container?.classList.add("active");
    } else {
      document.querySelector(".search-container")?.classList.remove("active");
    }
  }
});

async function getCountries() {
  const data = await getData<CountryAPI[]>(`${URL_BASE}/countries`);
  state.countries = data.map(normalizeCountriesAPI);
}

async function init() {
  await getCountries();
  const suggestions = new Suggestions(
    state.countries,
    ".header-section",
    ".search-container"
  );
  const dashboard = new Dashboard(".app");

  if (!inputSearch && !form) return;
  ["click", "change", "focus", "input"].forEach((events) => {
    suggestions.searchContainer?.addEventListener(events, filterResults);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!inputSearch) return;

    const country = state.queries[1][0].slug;
    dashboard.getDataCountry(country);
    inputSearch.value = "";
  });

  await dashboard.getDataSummary();

  /////////////// FUNCTIONS ///////////////////
  function filterResults() {
    suggestions.searchContainer?.classList.add("active");
    if (!inputSearch) return;
    state.queries[0] = inputSearch.value.trim();

    if (state.queries[0]) {
      const results = state.countries.filter((country) => {
        const normalize = country.country.toLowerCase();
        return normalize.includes(state.queries[0].toLowerCase());
      });
      state.queries[1] = results;
      suggestions.generateMarkupSuggestions(state.queries[1]);
    } else {
      suggestions.generateMarkupSuggestions();
    }
    suggestions.suggestions?.addEventListener("click", getCountryClicked);
  }

  function getCountryClicked(e: Event) {
    if (!(e.target instanceof HTMLLIElement && inputSearch)) return;
    inputSearch.value = `${e.target.textContent}`;
    state.queries[0] = inputSearch.value;
    filterResults();
    document.querySelector<HTMLInputElement>("#submit")?.click();
  }
}

init();
