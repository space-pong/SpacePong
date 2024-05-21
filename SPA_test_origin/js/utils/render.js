//공통 렌더링 함수 및 유틸리티 함수들을 포함합니다.
export function renderPage(page) {
  const app = document.getElementById('app');
  app.innerHTML = page;
}
