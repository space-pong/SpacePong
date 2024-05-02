//CounterPage.js
import Component from '../core/Component.js';
import Counter from '../components/Counter.js';

export default class CounterPage extends Component {
  template() {
    return `
        <h1>Counter Page</h1>
        <div data-component="counter-up"></div>
    `;
  }

  mounted() {
    const $counter = this.$target.querySelector(
      '[data-component="counter-up"]'
    );
    new Counter($counter);
  }
}
