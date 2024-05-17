export default class RouterButton {
  constructor({$parent, setState}) {
      this.$parent = $parent;
      this.setState = setState;
      this.render();
  }

  render() {
      this.$parent.insertAdjacentHTML('beforeend', this.template());
      this.setEvent();
  }

  template() {
      return `
          <div>
              <button class="A">Go to A</button>
              <button class="B">Go to B</button>
              <button class="C">Go to C</button>
          </div>
      `;
  }

  setEvent() {
      this.$parent.addEventListener('click', (event) => {
          const { target } = event;
          if (target.classList.contains('A')) {
              this.setState({ locate: '/A' });
          }
          if (target.classList.contains('B')) {
              this.setState({ locate: '/B' });
          }
          if (target.classList.contains('C')) {
              this.setState({ locate: '/C' });
          }
      });
  }
}