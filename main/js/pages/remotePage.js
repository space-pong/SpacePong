export const remotePage = {
  html: `
  <div class="control-bar__remote">
    <header="control-bar__remote__header>Unit</header>
    <div class="control-bar__remote__unit-selector">
      <label class="unit-option">
        <input type="radio" name="unit" value="42lien">
        <span class="custom-radio"></span>
        42lien
      </label>
      <label class="unit-option">
        <input type="radio" name="unit" value="Zerg">
        <span class="custom-radio"></span>
        Zerg
      </label>
      <label class="unit-option">
        <input type="radio" name="unit" value="Terran">
        <span class="custom-radio"></span>
        Terran
      </label>
      <label class="unit-option">
        <input type="radio" name="unit" value="Protoss">
        <span class="custom-radio"></span>
        Protoss
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