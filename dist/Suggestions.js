export default class Suggestions {
    list;
    parentElement;
    searchContainer;
    suggestions;
    constructor(list, selectorParent, selectorSearchContainer) {
        this.list = list;
        this.parentElement = document.querySelector(selectorParent);
        this.searchContainer = this.parentElement?.querySelector(selectorSearchContainer);
        this.suggestions;
    }
    generateMarkupSuggestions(list = this.list) {
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
    renderSuggestions(markup) {
        if (!this.searchContainer)
            return;
        this.searchContainer.insertAdjacentHTML("beforeend", markup);
        this.suggestions = this.parentElement?.querySelector(".suggestions");
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
