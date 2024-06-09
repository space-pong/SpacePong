import globalState from "../globalState.js";

export const gameResultPage = {
  getHtml() {
    return `
    <div class="control-bar__title">Winner</div>
    <div class="control-bar__type">${globalState.winner}</div>
    <div class="control-bar__confirm">
      <button href="" class="control-bar__confirm__btn--next" data-link>Next</button>
    </div>
    `;
  },
  css: 'styles/css/gameResultPage.css'
};