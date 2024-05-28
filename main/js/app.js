import { renderPage } from './utils/renderPage.js';
import login from './pages/login.js';
import main from './pages/main.js';
import singleAI from './pagessingleAI.js';
import singleOneToOne from './pages/singleOneToOne.js';
import singleTournament from './pages/singleTournament.js';
import localOneToOne from './pages/localOneToOne.js';

const routes = {
  login: login,
  main: main,
  singleAI: singleAI,
  singleOneToOne: singleOneToOne,
  singleTournament: singleTournament,
  localOneToOne: localOneToOne
};

function init() {
  // 기본적으로 로그인 페이지를 로드
  renderPage(routes.login);

  // 페이지 전환을 위한 이벤트 설정
  document.body.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
          const page = e.target.getAttribute('data-link');
          renderPage(routes[page]);
          history.pushState({ page }, '', page);
      }
  });
}

window.addEventListener('popstate', (event) => {
  const page = event.state?.page || 'login';
  renderPage(routes[page]);
});

window.addEventListener('DOMContentLoaded', init);