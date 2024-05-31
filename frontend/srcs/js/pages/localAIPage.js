export const localAIPage = {
  html: `
  <div class="control-bar__localAI">
    <div class="control-bar__localAI__title">single Play</div>
    <div class="control-bar__localAI__type">AI</div>
    <div class="control-bar__localAI__icon">
      <img src="/frontend/srcs/assets/images/icon_ai.svg" alt="icon of AI">
    </div>
    <div class="control-bar__localAI__confirm">
      <button class="control-bar__localAI__confirm__btn--play">Play</button>
      <button class="control-bar__localAI__confirm__btn--cancel" data-link="mainPage">Cancel</button>
    </div>
  </div>
  `,
  css: 'styles/css/localAIPage.css'
};