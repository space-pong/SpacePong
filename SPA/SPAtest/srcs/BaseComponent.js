export default class BaseComponent {

  constructor({$parent, setState, state}){
      this.$parent = $parent;
      this.state = state;
      this.setState = setState;
  }
  
  template(){
      return '';
  }

  #render(){
      const template = this.template();
      this.$parent.insertAdjacentHTML('beforeend', template);
  }

  setEvent(){

  }

  renderSequence(state){
      this.state = state;
      this.#render();
      this.setEvent();
  }
}