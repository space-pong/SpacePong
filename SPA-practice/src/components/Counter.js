import Component from '../core/Component.js';

export default class Counter extends Component {
  setup() {
    this.$state = {
      counter: 0,
    };
  }

  template() {
    const { counter } = this.$state;
    return `
      <div>
        <h2>Counter Component</h2>
        <div>${counter}</div>
        <button class='up'>증가</button>
        <button class='down'>감소</button>
      </div>
    `;
  }

  setEvent() {
    this.addEvent('click', '.up', ({ target }) => {
      const prev = this.$state.counter;
      this.up(prev);
    });

    this.addEvent('click', '.down', ({ target }) => {
      const prev = this.$state.counter;
      this.down(prev);
    });
  }

  up(prev) {
    this.setState({ counter: prev + 1 });
  }

  down(prev) {
    this.setState({ counter: prev - 1 });
  }
}