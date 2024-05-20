import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Posts");
  }

  async getHTML() {
    return `
      <p>404 Not Found!</p>
    `;
  }
}