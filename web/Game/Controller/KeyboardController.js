import { Controller } from "./Controller.js";

export class KeyboardController extends Controller {
  constructor(leftKeycode, rightKeycode, upKeycode, downKeycode, hotKeycode) {
    super();
    this.leftKeycode = leftKeycode;
    this.rightKeycode = rightKeycode;
    this.upKeycode = upKeycode;
    this.downKeycode = downKeycode;
    this.hotKeycode = hotKeycode;
    this.keydownListener = this.keydownListener.bind(this);
    this.keyupListener = this.keyupListener.bind(this);
    window.addEventListener('keydown', this.keydownListener);
    window.addEventListener('keyup', this.keyupListener);
  }

  keydownListener(event) {
    const keycode = event.keyCode;
    switch (keycode) {
      case this.leftKeycode:
        this.left = true;
        break;
      case this.rightKeycode:
        this.right = true;
        break;
      case this.upKeycode:
        this.up = true;
        break;
      case this.downKeycode:
        this.down = true;
        break;
      case this.hotKeycode:
        this.hot = true;
        break;
      default:
        break;
    }
  }

  keyupListener(event) {
    const keycode = event.keyCode;
    switch (keycode) {
      case this.leftKeycode:
        this.left = false;
        break;
      case this.rightKeycode:
        this.right = false;
        break;
      case this.upKeycode:
        this.up = false;
        break;
      case this.downKeycode:
        this.down = false;
        break;
      case this.hotKeycode:
        this.hot = false;
        break;
      default:
        break;
    }
  }
}
