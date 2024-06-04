export const mainPage = {
  getHtml() {
    return `
    <div class="control-bar__icon">
      <img src="./assets/images/icon_logout.svg" data-link="loginPage" alt="logout">
      <img src="./assets/images/icon_controller.svg" alt="controller">
      <img src="./assets/images/icon_setting.svg" alt="setting">
    </div>
    <div class="control-bar__mode--text" data-link="unitSelectPage" data-target="remoteMatchPage">Remote Play</div>
    <div class="control-bar__mode--text" data-link="localTournamentPage">Tournament </div>
    <div class="control-bar__mode--text" data-link="localOneToOnePage">1 vs 1</div>
    <div class="control-bar__mode--text" data-link="unitSelectPage" data-target="localAIPage">AI</div>
    `;
  },
  css: 'styles/css/mainPage.css'
};
