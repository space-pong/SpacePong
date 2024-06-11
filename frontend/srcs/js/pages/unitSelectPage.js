import globalState from "../globalState.js";
import { loadTranslation } from "../utils/translate.js";

export const unitSelectPage = {
  async getHtml() {
    return `
    <div class="control-bar__title">${await loadTranslation('Unit')}</div>
    <div class="control-bar__type">${globalState.currentAlias}</div>
    <div class="control-bar__unit-selector">
      <label class="unit-selector__unit-option">
        <span class="unit-selector__unit-name">${await loadTranslation('Default')}</span>
        <input type="radio" name="unit" value="Default" checked>
      </label>
      <label class="unit-selector__unit-option">
        <span class="unit-selector__unit-name">${await loadTranslation('Zerg')}</span>
        <input type="radio" name="unit" value="Zerg">
      </label>
    </div>
    <div class="control-bar__confirm">
      <button href="" class="control-bar__confirm__btn--select" data-link>${await loadTranslation('Select')}</button>
      <button href="/" class="control-bar__confirm__btn--cancel" data-link>${await loadTranslation('Cancel')}</button>
    </div>
    `;

  },
  css: 'styles/css/unitSelectPage.css',
};
