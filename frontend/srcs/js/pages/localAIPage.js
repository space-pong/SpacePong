export const localAIPage = {
  getHtml() {
    return `
    <div class="control-bar__title">AI</div>
    <div class="control-bar__type">Deep Thought</div>
    <div class="control-bar__icon">
      <img src="./assets/images/icon_ai.svg" alt="icon of AI">
    </div>
    <div class="control-bar__confirm">
      <button href="/game" class="control-bar__confirm__btn--play" data-link>Play</button>
      <button href="/unitSelect" class="control-bar__confirm__btn--cancel" data-link data-target="localAIPage">Cancel</button>
    </div>
    `;
  },
  css: 'styles/css/localAIPage.css'
};