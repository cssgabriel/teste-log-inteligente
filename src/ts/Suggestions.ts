export default class Suggestions {
  list: Country[];
  parentElement: HTMLElement | null;
  searchContainer: HTMLElement | undefined | null;
  suggestions: HTMLElement | null | undefined;
  constructor(
    list: Country[],
    selectorParent: string,
    selectorSearchContainer: string
  ) {
    this.list = list;
    this.parentElement = document.querySelector(selectorParent);
    this.searchContainer = this.parentElement?.querySelector(
      selectorSearchContainer
    );
    this.suggestions;
  }

  generateMarkupSuggestions(list: Country[] = this.list) {
    let markup = ``;
    if (this.suggestions) {
      this.suggestions.remove();
      markup = `
        <ul>
          ${list.map((country) => `<li>${country.country}</li>`).join("")}
        </ul>
      `;
    }
    markup = `
      <div class="suggestions">
        <ul>
          ${list.map((country) => `<li>${country.country}</li>`).join("")}
        </ul>
      </div>
    `;
    this.renderSuggestions(markup);
  }

  renderSuggestions(markup: string) {
    if (!this.searchContainer) return;
    this.searchContainer.insertAdjacentHTML("beforeend", markup);
    this.suggestions = this.parentElement?.querySelector(".suggestions");
    // this.addEventInLi();
  }

  addEventInLi() {
    const listLi = this.searchContainer?.querySelectorAll("li");
    listLi?.forEach((li) => {
      li.addEventListener("click", function () {
        console.log(this);
      });
    });
  }
}
