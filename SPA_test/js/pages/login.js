//로그인 페이지의 콘텐츠와 로직을 포함합니다.

const loginPage = {
  html: `
  <body>
  <div class="mainbox">
    <div class="mainbox__inner">
      <header class="mainbox__header">SPACE PONG</header>
      <div class="mainbox__control-bar">
        <div class="control-bar">
          <div class="control-bar__login">
            <div class="control-bar__login__btn" data-link="mode_select">
              42 Login
            </div>
          </div>
        </div>
      </div>
      <div class="mainbox__img" >
        <img class="mainbox__img--moon" src="assets/images/moon.png" alt="image of moon">
      </div>
      <footer class="mainbox__footer">ft_transcendence</footer>
    </div>
  </div>
</body>
  `,
  css: './style/login.css'
};

export default loginPage;
