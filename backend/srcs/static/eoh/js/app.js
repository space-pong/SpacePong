//애플리케이션의 메인 로직을 포함합니다.

import { renderPage } from './utils/render.js';
import loginPage from './pages/login.js';
import modeSelectPage from './pages/mode_select.js';
import gamepage from './pages/game.js';

const routes = {
    login: loginPage,
    mode_select: modeSelectPage,
    game: gamepage,
};

async function fetchTokens() {
  try {
    // 현재 URL에서 코드 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (!code) {
      throw new Error('No authorization code provided');
    }
    
    // 액세스 토큰 요청을 위한 fetch 요청
    const response = await fetch(`http://localhost:8000/auth42/callback?code=${code}`, {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    });
    if (!response.ok) {
      throw new Error('Failed to fetch tokens');
    }
    
    // JSON 형식의 응답 데이터 파싱
    const data = await response.json();
    
    // 로컬 스토리지에 토큰 저장
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    
    // 모드 선택 페이지 렌더링
    renderPage(modeSelectPage);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return null;
  }
}

async function init() {
  // 기본적으로 로그인 페이지를 로드
  const currentPath = window.location.pathname;
  await fetchTokens();
  if (currentPath.startsWith('/chat/mode_select')) {
    const Token = localStorage.getItem('accessToken');
    if (Token)
      renderPage(modeSelectPage);
    else 
      renderPage(loginPage);
  } else {
    const Token = localStorage.getItem('accessToken');
    if (Token)
      renderPage(modeSelectPage);
    else 
      renderPage(loginPage);
  }
  // 페이지 전환을 위한 이벤트 설정
  document.body.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
          const page = e.target.getAttribute('data-link');
          if (page == "auth42") {
            window.location.pathname = '/auth42/login/';
          }
          else if (page == 'login') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            renderPage(loginPage);
          }
          else
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