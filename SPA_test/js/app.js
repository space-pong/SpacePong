//애플리케이션의 메인 로직을 포함합니다.

import { renderPage } from './utils/render.js';
import loginPage from './pages/login.js';
import modeSelectPage from './pages/mode_select.js';

const routes = {
    login: loginPage,
    mode_select: modeSelectPage,
};

function init() {
    // 기본적으로 로그인 페이지를 로드
    renderPage(routes.login);

    // 페이지 전환을 위한 이벤트 설정
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('[data-link]')) {
            const page = e.target.getAttribute('data-link');
            renderPage(routes[page]);
        }
    });
}

window.addEventListener('DOMContentLoaded', init);
