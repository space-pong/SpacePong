import { Controller } from "./Controller.js";

export class RemoteController extends Controller {
  constructor(key) {
    super();
    this.key = key;
    this.update = this.update.bind(this);
  }

  update() {
    // 서버로부터 데이터를 받아, 키값 갱신
    setTimeout(this.update, 30); // 30ms에 한 번.
  }

}
