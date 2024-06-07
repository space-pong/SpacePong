export const mainPage = {
  getHtml() {
    return `
    <div class="control-bar__icon">
      <img src="./assets/images/icon_logout.svg" data-link="loginPage" alt="logout">
      <img src="./assets/images/icon_controller.svg" alt="controller">
      <img src="./assets/images/icon_setting.svg" alt="setting">
    </div>
    <a href="/remoteMatch" class="control-bar__mode--text" data-link="unitSelectPage" game-mode="remote">Remote Play</a>
    <div class="control-bar__mode--text" data-link="tournamentFillAliasPage" game-mode="tournament">Tournament </div>
    <div class="control-bar__mode--text" data-link="localOneToOnePage">1 vs 1</div>
    <div href="/remoteMatch" class="control-bar__mode--text" data-link="unitSelectPage" game-mode="ai">AI</div>
    `;
  },
  css: 'styles/css/mainPage.css'
};
