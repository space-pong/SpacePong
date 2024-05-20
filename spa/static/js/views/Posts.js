import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Posts");
  }

  async getHTML() {
    return `
    <h1>Posts</h1>
    <p>게시글들 나열</p>
    <a href="/Login" class="nav__link" data-link>로그인</a>
    `;
  }
}