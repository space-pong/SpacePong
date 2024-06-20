export const remoteMatchPage = {
  getHtml() {
    return `
    <div class="control-bar__remoteMatch__title">Finding match</div>
    <div class="control-bar__remoteMatch__type">1 vs 1</div>
    <div class="control-bar__remoteMatch__icon">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="control-bar__remoteMatch__confirm">
      <button href="/unitSelect" class="control-bar__remoteMatch__confirm__btn--cancel" data-link data-target="remoteMatchPage">Cancel</button>
    </div>
    `;
  },
  css: 'styles/css/remoteMatchPage.css'
};
