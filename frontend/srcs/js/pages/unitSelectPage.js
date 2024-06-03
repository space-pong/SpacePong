import globalState from "../globalState.js";

export const unitSelectPage = {
  html: `
  <div class="control-bar__title">${globalState.currentAlias} Unit</div>
  <div class="control-bar__unit-selector">
    <label class="unit-selector__unit-option">
      <span class=unit-selector__unit-name>Default</span>
      <input type="radio" name="unit" value="Default">
    </label>
    <label class="unit-selector__unit-option">
      <span class=unit-selector__unit-name>Zerg</span>
      <input type="radio" name="unit" value="Zerg">
    </label>
  </div>
  <div class="control-bar__confirm">
    <button class="control-bar__confirm__btn--select" data-link="dynamicPage">Select</button>
    <button class="control-bar__confirm__btn--cancel" data-link="mainPage">Cancel</button>
  </div>
  `,
  css: 'styles/css/unitSelectPage.css'
};