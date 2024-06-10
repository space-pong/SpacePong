export const mainPage = {
  getHtml() {
    return `
    <div class="control-bar__icon">
      <img src="./assets/images/icon_logout.svg" href="/login" data-link alt="logout">
      <img src="./assets/images/icon_controller.svg" alt="controller">
      <img src="./assets/images/icon_setting.svg" alt="setting">
    </div>
    <div href="/unitSelect" class="control-bar__mode--text" data-link game-mode="remote">Remote Play</div>
    <div href="/tournamentFill" class="control-bar__mode--text" data-link game-mode="tournament">Tournament </div>
    <div href="/pvpFill" class="control-bar__mode--text" data-link game-mode="pvp">1 vs 1</div>
    <div href="/unitSelect" class="control-bar__mode--text" data-link game-mode="ai">AI</div>
    `;
  },
  css: 'styles/css/mainPage.css'
};
