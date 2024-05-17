import A from './pages/A.js';
import B from './pages/B.js';
import C from './pages/C.js';
import RouterButton from './pages/RouterButton.js';

class App {
    constructor() {
        this.state = { locate: window.location.pathname };
        this.root = document.querySelector('.app');

        const ObjectForDI = { $parent: this.root, setState: this.setState.bind(this), state: this.state };

        this.A = new A(ObjectForDI);
        this.B = new B(ObjectForDI);
        this.C = new C(ObjectForDI);
        this.RouterButton = new RouterButton(ObjectForDI);

        this.render();
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    render() {
        this.root.innerHTML = '';

        this.RouterButton.render();

        const { locate } = this.state;

        if (locate === '/A') {
            this.A.renderSequence(this.state);
        } else if (locate === '/B') {
            this.B.renderSequence(this.state);
        } else {
            this.C.renderSequence(this.state);
        }

        this.historyRouterPush(locate);
    }

    historyRouterPush(locate) {
        window.history.pushState({}, locate, window.location.origin + locate);
    }
}

new App();