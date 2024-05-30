export const singleTournamentPage = {
  html: `
  <div class="control-bar__tournament">
  <header class="control-bar__tournament__header">Tournament</header>
  <div class="control-bar__tournament__alias-set">
    <div class="control-bar__tournament__alias-set__input">
      <input type="text" name="alias" required placeholder="guest1" onfocus="this.placeholder=''" onblur="this.placeholder='guest1'">
    </div>
    <div class="control-bar__tournament__alias-set__input">
      <input type="text" name="alias" required placeholder="guest2" onfocus="this.placeholder=''" onblur="this.placeholder='guest2'">
    </div>
    <div class="control-bar__tournament__alias-set__input">
      <input type="text" name="alias" required placeholder="guest3" onfocus="this.placeholder=''" onblur="this.placeholder='guest3'">
    </div>
    <div class="control-bar__tournament__alias-set__input">
      <input type="text" name="alias" required placeholder="guest4" onfocus="this.placeholder=''" onblur="this.placeholder='guest4'">
    </div>
  </div>
  <div class=control-bar__tournament__blank-box></div>
  <div class="control-bar__tournament__confirm">
    <button class="control-bar__tournament__confirm__btn--play">Play</button>
    <button class="control-bar__tournament__confirm__btn--cancel" data-link="mainPage">Cancel</button>
  </div>
</div>
  `,
  css: 'styles/css/singleTournament.css'
};