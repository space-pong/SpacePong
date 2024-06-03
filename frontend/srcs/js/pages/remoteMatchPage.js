export const remoteMatchPage = {
  html: `
  <div class="control-bar__remoteMatch">
    <div class="control-bar__remoteMatch__title">Finding match</div>
    <div class="control-bar__remoteMatch__type">1 vs 1</div>
    <div class="control-bar__remoteMatch__icon">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="control-bar__remoteMatch__confirm">
      <button class="control-bar__remoteMatch__confirm__btn--cancel" data-link="unitSelectPage" data-target="remoteMatchPage">Cancel</button>
    </div>
  </div>
  `,
  css: 'styles/css/remoteMatchPage.css'
};
