import getData from "./getData.js";
import { normalizeDataAPI } from "./normalizeDataAPI.js";
import { URL_TOTAL_COUNTRY, URL_SUMMARY } from "./config.js";
export default class Dashboard {
    parentElement;
    results;
    slug;
    date;
    table;
    allStatus;
    constructor(selector) {
        this.parentElement = document.querySelector(selector);
        this.results = document.querySelector(".results-section__data-by-country");
        this.table = null;
        this.slug = "";
        this.date = new Date();
        this.allStatus = null;
    }
    async getDataSummary() {
        try {
            const summary = await getData(URL_SUMMARY);
            const markup = this._generateMarkupSummary(summary);
            this.renderData(markup);
        }
        catch (err) {
            throw new Error();
        }
    }
    async getDataCountry(country) {
        try {
            const data = await getData(`${URL_TOTAL_COUNTRY}/${country}`);
            const dataNormalize = data.map(normalizeDataAPI).at(-1);
            this.allStatus = data.map(normalizeDataAPI);
            if (!dataNormalize)
                return;
            const [y, m, d] = dataNormalize.date.split("T")[0].split("-");
            this.date = new Date(this.date.setFullYear(+y, +m - 1, +d));
            const markup = this._generateMarkupCountry(dataNormalize);
            this.renderData(markup);
            this.slug = country;
        }
        catch (err) {
            throw new Error();
        }
    }
    getDataDays(qtdDays) {
        if (!this.allStatus)
            return;
        qtdDays = qtdDays || this.allStatus.length;
        const filterStatus = this.allStatus.slice(-qtdDays);
        if (!filterStatus.length)
            return;
        const markup = this._generateMarkupDays(filterStatus);
        this.renderDays(markup);
    }
    _generateMarkupSummary({ Global }) {
        const markup = `
      <section class="results-section__data-by-country container">
        <h2>Global</h2>
        <div class="total">
          <p>Apurado até
            ${Global.Date.split("T")[0].split("-").reverse().join("/")}
          </p>
          <h3>Confirmados: ${Global.TotalConfirmed.toLocaleString("pt-BR")}.</h3>
          <h3>Recuperados: 
            ${(Global.TotalConfirmed - Global.TotalDeaths).toLocaleString("pt-BR")}.
          </h3>
          <h3>Óbitos: ${Global.TotalDeaths.toLocaleString("pt-BR")}.</h3>
        </div>
      </section>
    `;
        return markup;
    }
    _generateMarkupCountry(country) {
        const markup = `
      <section class="results-section__data-by-country container">
        <h2>${country.country}</h2>
        <div class="results-section__filters">
          <label>Filtrar por data:</label>
          <input type="date">
        </div>
        <div class="total">
          <p>Apurado até ${country.date
            .split("T")[0]
            .split("-")
            .reverse()
            .join("/")}</p>
          <h3>Confirmados: ${country.confirmed.toLocaleString("pt-BR")}.</h3>
          <h3>Recuperados: ${(country.confirmed - country.deaths).toLocaleString("pt-BR")}.</h3>
          <h3>Óbitos: ${country.deaths.toLocaleString("pt-BR")}.</h3>
        </div>
        <button>Ver dados dos últimos 10 dias</button>
      </section>
    `;
        return markup;
    }
    _generateMarkupDays(days) {
        function check(current, last) {
            if (current ?? last) {
                if (current > last)
                    return "increased";
                else if (current < last)
                    return "decreased";
                else
                    return "equal";
            }
            else {
                return "";
            }
        }
        const markup = `
      <table class="container">
        <thead>
          <tr>
            <th>Data</th>
            <th>Confirmados</th>
            <th>Recuperados</th>
            <th>Óbitos</th>
          </tr>
        </thead>
        <tbody>
          ${days
            .map((day, i) => {
            return `
                <tr>
                  <td>${day.date
                .split("T")[0]
                .split("-")
                .reverse()
                .join("/")}</td>
                  <td data-compare="${check(day.confirmed, days[i - 1]?.confirmed)}">
                    ${days[i - 1]
                ? (day.confirmed - days[i - 1]?.confirmed).toLocaleString()
                : day.confirmed.toLocaleString()}
                  </td>
                  <td data-compare="${check(day.recovered, days[i - 1]?.recovered)}">
                    ${days[i - 1]
                ? (day.recovered - days[i - 1]?.recovered).toLocaleString()
                : day.recovered.toLocaleString()}
                  </td>
                  <td data-compare="${check(day.deaths, days[i - 1]?.deaths)}">
                    ${days[i - 1]
                ? (day.deaths - days[i - 1]?.deaths).toLocaleString()
                : day.deaths.toLocaleString()}
                  </td>
                </tr>
              `;
        })
            .join("")}
        </tbody>
      </table>
      ${days.length === this.allStatus?.length
            ? ""
            : `<button class="load-more">Carregar todos os dados</button>`}
    `;
        return markup;
    }
    renderData(markup, clear = true) {
        if (this.parentElement?.innerHTML && clear) {
            this.parentElement.innerHTML = "";
        }
        this.parentElement?.insertAdjacentHTML("beforeend", markup);
        const button = this.parentElement?.querySelector("button");
        if (!button)
            return;
        button.addEventListener("click", () => {
            this.getDataDays(10);
        });
    }
    renderDays(markup, clear = true) {
        if (this.table && clear) {
            this.table.nextElementSibling?.remove();
            this.table.remove();
        }
        this.parentElement?.insertAdjacentHTML("beforeend", markup);
        this.table = document.querySelector("table");
        const btnLoadMore = this.parentElement?.querySelector("button.load-more");
        if (!btnLoadMore)
            return;
        btnLoadMore.addEventListener("click", () => {
            this.getDataDays();
        });
    }
}
