export const localOneToOnePage = {
  html: `
  <div class="control-bar__OneToOne">
  <header class="control-bar__OneToOne__header">1 vs 1</header>
  <div class="control-bar__OneToOne__alias-set">
    <div class="control-bar__OneToOne__alias-set__input">
      <input type="text" name="alias" required placeholder="guest1" onfocus="this.placeholder=''" onblur="this.placeholder='guest1'">
    </div>
    <div class="control-bar__OneToOne__alias-set__input">
      <input type="text" name="alias" required placeholder="guest2" onfocus="this.placeholder=''" onblur="this.placeholder='guest2'">
    </div>
  </div>
  <div class=control-bar__OneToOne__blank-box></div>
  <div class="control-bar__OneToOne__confirm">
    <button class="control-bar__OneToOne__confirm__btn--play">Play</button>
    <button class="control-bar__OneToOne__confirm__btn--cancel" data-link="mainPage">Cancel</button>
  </div>
</div>
  `,
  css: 'styles/css/localOneToOne.css'
};