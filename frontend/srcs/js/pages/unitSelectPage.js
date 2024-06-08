import globalState from "../globalState.js";

export const unitSelectPage = {
  getHtml() {
    return `
    <div class="control-bar__title">Unit</div>
    <div class="control-bar__type">${globalState.currentAlias}</div>
    <div class="control-bar__unit-selector">
      <label class="unit-selector__unit-option">
        <span class=unit-selector__unit-name>Default</span>
        <input type="radio" name="unit" value="Default" checked>
      </label>
      <label class="unit-selector__unit-option">
        <span class=unit-selector__unit-name>Zerg</span>
        <input type="radio" name="unit" value="Zerg">
      </label>
    </div>
    <div class="control-bar__confirm">
      <button href="" class="control-bar__confirm__btn--select" data-link>Select</button>
      <button href="/" class="control-bar__confirm__btn--cancel" data-link>Cancel</button>
    </div>
    `;
  },
  css: 'styles/css/unitSelectPage.css'
};