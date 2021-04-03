import { AmbientLight, PointLight } from "three";

export default class Lighting {
  constructor(app) {
    this.app = app;

    this.initLights();

    this.initialStrength = 1.2;
  }

  initLights() {
    const ambientLight = new AmbientLight(0xffffff, 0.3);
    this.app.scene.add(ambientLight);

    this.light = new PointLight(0xffffff, this.initialStrength);

    this.app.camera.add(this.light);
    this.app.scene.add(this.app.camera);
  }
}
