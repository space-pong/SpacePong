//모드 선택 페이지의 콘텐츠와 로직을 포함합니다.
const modeSelectPage = {
  html: `
  <body>
  <div class="mainbox">
    <div class="mainbox__inner">
      <header class="mainbox__header">SPACE PONG</header>
      <div class="mainbox__control-bar">
        <div class="control-bar">
          <div class="control-bar__profile">
              <div class="control-bar__profile__icon">
                <img class="control-bar__profile__icon--logout" src="assets/images/icon_logout.png" alt="logout" data-link="login">
                <img class="control-bar__profile__icon--info" src="assets/images/icon_info.png" alt="logout" data-link="game">
                <img class="control-bar__profile__icon--setting" src="assets/images/icon_setting.png" alt="logout">
              </div>
          </div>
          <div class="control-bar__mode">
            <div class="control-bar__mode__title">
              <img class="control-bar__mode__title--online" src = "assets/images/online.png" alt="online">
            </div>
            <div class="control-bar__mode__name">Tournament</div>
            <div class="control-bar__mode__name">1 vs 1</div>
            <div class="control-bar__mode__title">
              <img class="control-bar__mode__title--local" src="assets/images/local.png" alt="online">
            </div>
            <div class="control-bar__mode__name">Tournament</div>
            <div class="control-bar__mode__name">1 vs 1</div>
            <div class="control-bar__mode__name">Single Play</div>
        </div>
      </div>
    </div>
    <div class="mainbox__img">
      <img class="mainbox__img--moon" src="assets/images/moon.png" alt="image of moon">
    </div>
    <footer class="mainbox__footer">ft_transcendence</footer>
  </div>
</body>
  `,
  css: './style/mode_select.css'
};

export default modeSelectPage;
