export const mainPage = {
  html: `
  <div class="control-bar__icon">
    <img src="/frontend/srcs/assets/images/icon_logout.svg" data-link="loginPage" alt="logout">
    <img src="/frontend/srcs/assets/images/icon_controller.svg" alt="controller">
    <img src="/frontend/srcs/assets/images/icon_setting.svg" alt="setting">
  </div>
  <div class="control-bar__mode--text" data-link="remotePage">Remote Play</div>
  <div class="control-bar__mode--text" data-link="localTournamentPage">Tournament </div>
  <div class="control-bar__mode--text" data-link="localOneToOnePage">1 vs 1</div>
  <div class="control-bar__mode--text" data-link="localAIPage">Single Play </div>
  `,
  css: 'styles/css/mainPage.css'
};
