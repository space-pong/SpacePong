import Component from './core/Component.js';
import SpacePongPage from './pages/SpacePongPage.js';

export default class App extends Component {
  template() {
    return `
      <main data-component="counter-app"></main>
    `;
  }

  mounted() {
    const $counterApp = this.$target.querySelector(
      '[data-component="counter-app"]'
    );
    new SpacePongPage($counterApp);
  }
}

