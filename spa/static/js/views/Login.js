import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Login");
  }

  async getHTML() {
    return `
      <p>로그인</p>
    `;
  }
}