export const remotePage = {
  html: `
  <div class="control-bar__remote">
    <header class="control-bar__remote__header">Unit</header>
    <div class="control-bar__remote__unit-selector">
      <label class="unit-selector__unit-option">
        <span class=unit-selector__unit-name>42lien</span>
        <input type="radio" name="unit" value="42lien">
      </label>
      <label class="unit-selector__unit-option">
        <span class=unit-selector__unit-name>Zerg</span>
        <input type="radio" name="unit" value="Zerg">
      </label>
      <label class="unit-selector__unit-option">
        <span class=unit-selector__unit-name>Terran</span>
        <input type="radio" name="unit" value="Terran">
      </label>
      <label class="unit-selector__unit-option">
        <span class=unit-selector__unit-name>Protoss</span>
        <input type="radio" name="unit" value="Protoss">
      </label>
    </div>
    <div class="control-bar__remote__confirm">
      <button class="control-bar__remote__confirm__btn--select">Select</button>
      <button class="control-bar__remote__confirm__btn--cancel" data-link="mainPage">Cancel</button>
    </div>
</div>
  `,
  css: 'styles/css/remotePage.css'
};