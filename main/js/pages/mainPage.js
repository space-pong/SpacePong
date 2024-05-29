export const mainPage = {
  html: `
  <div class="control-bar__main">
  <div class="control-bar__main__icon">
    <div class="control-bar__main__icon--logout">
      <img src="/main/assets/images/icon_logout.svg" data-link="loginPage" alt="logout">
    </div>
    <div class="control-bar__main__icon--controller"></div>
      <img src="/main/assets/images/icon_controller.svg" alt="controller">
      <div class="control-bar__main__icon--setting"></div>
        <img src="/main/assets/images/icon_setting.svg" alt="setting">
  </div>
  <div class="control-bar__main__online">
    <div class="control-bar__main__online__title">
      <hr class="control-bar__main__online__title--divider">
      <div class="control-bar__main__online__title--text">online</div>
      <hr class="control-bar__main__online__title--divider">
    </div>
    <div class="control-bar__main__online__mode">
      <div class="control-bar__main__online__mode--text" data-link="localOneToOnePage">Remote Play</div>
    </div>
  </div>
  <div class="control-bar__main__local">
    <div class="control-bar__main__local__title">
      <hr class="control-bar__main__local__title--divider">
      <div class="control-bar__main__local__title--text">local</div>
      <hr class="control-bar__main__local__title--divider">
    </div>
    <div class="control-bar__main__local__mode">
      <div class="control-bar__main__local__mode--text" data-link="SingleTournamentPage">Tournament </div>
      <div class="control-bar__main__local__mode--text" data-link="singleOneToOnePage">1 vs 1</div>
      <div class="control-bar__main__local__mode--text" data-link="singleAIPage">Single Play </div>
    </div>
  </div>
</div>
  `,
  css: 'styles/css/mainPage.css'
};