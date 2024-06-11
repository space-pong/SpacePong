import globalState from "../globalState.js";
import { translate } from "../utils/translate.js";

export const unitSelectPage = {
  getHtml() {
    const html = `
    <div id="unit" class="control-bar__title">Unit</div>
    <div class="control-bar__type">${globalState.currentAlias}</div>
    <div class="control-bar__unit-selector">
      <label class="unit-selector__unit-option">
        <span id="default" class="unit-selector__unit-name">Loading...</span>
        <input type="radio" name="unit" value="Default" checked>
      </label>
      <label class="unit-selector__unit-option">
        <span id="zerg" class="unit-selector__unit-name">Loading...</span>
        <input type="radio" name="unit" value="Zerg">
      </label>
    </div>
    <div class="control-bar__confirm">
      <button href="" class="control-bar__confirm__btn--select" data-link>Select</button>
      <button href="/" class="control-bar__confirm__btn--cancel" data-link>Cancel</button>
    </div>
    `;

    // After rendering HTML, trigger the translation
    setTimeout(() => {
      translate('unit', 'Unit');
      translate('default', 'Default');
      translate('zerg', 'Zerg');
    }, 0);

    return html;
  },
  css: 'styles/css/unitSelectPage.css',
};
