import Component from '../core/Component.js';
import Counter from '../components/Counter.js';

export default class SpacePongPage extends Component {
  template() {
    return `
      <div class="glass">
        <h1>SPACE PONG</h1>
      </div>

    `;
  }

  mounted() {
    const $counter = this.$target.querySelector(
      '[data-component="counter-up"]'
    );
    new Counter($counter);
  }
}
