import { Cache, MeshStandardMaterial, FrontSide, Mesh } from "three";

import "./utilities/logging.js";
import "./components/fullscreen.js";
import HTMLControl from "./HTMLControl.js";
import exportGLTF from "./components/exportGLTF.js";
import "./components/fileReader.js";
import Viewer from "./components/Viewer.js";
import loaders from "./components/Loaders.js";
import loadingManager from "./components/loadingManager.js";

Cache.enabled = true;

const defaultMat = new MeshStandardMaterial({
  color: 0xcccccc,
  side: FrontSide,
});

class Main {
  constructor(originalCanvas, resultCanvas) {
    this.originalPreview = new Viewer(originalCanvas);
    this.resultPreview = new Viewer(resultCanvas);

    this.loadingManagerOnLoadCalled = false;
    this.setUpExporter = false;

    this.loadedObject = null;
    this.animations = null;
    this.name = "scene";
  }

  load(promise, name = "scene", originalFile) {
    this.loadingManagerOnLoadCalled = false;
    this.setUpExporter = false;
    this.loadedObject = null;
    this.animations = null;
    this.name = "scene";

    loadingManager.onStart();

    loadingManager.onLoad = () => {
      if (this.loadingManagerOnLoadCalled === true) return;

      this.loadingManagerOnLoadCalled = true;

      if (this.setUpExporter === false)
        exportGLTF.setInput(this.loadedObject, this.animations, this.name);
    };

    promise
      .then((result) => {
        if (result.isGeometry || result.isBufferGeometry)
          this.onLoad(new Mesh(result, defaultMat));
        else if (result.isObject3D) this.onLoad(result, name);
        // glTF
        else if (result.scenes && result.scenes.length > 1) {
          result.scenes.forEach((scene) => {
            if (result.animations) scene.animations = result.animations;
            this.onLoad(scene, name);
          });
        }
        // glTF or Collada
        else if (result.scene) {
          if (result.animations) result.scene.animations = result.animations;
          this.onLoad(result.scene, name);
        } else console.error("No scene found in file!");
      })
      .catch((err) => {
        if (
          typeof err.message &&
          err.message.indexOf("Use LegacyGLTFLoader instead") !== -1
        ) {
          this.load(loaders.legacyGltfLoader(originalFile));
        } else {
          console.error(err);
        }
      });

    return promise;
  }

  onLoad(object, name) {
    HTMLControl.setOnLoadEndState();

    object.traverse((child) => {
      if (child.material && Array.isArray(child.material)) {
        console.error("Multimaterials are currently not supported.");
      }
    });

    let animations = [];
    if (object.animations) animations = object.animations;

    this.originalPreview.addObjectToScene(object);
    this.resultPreview.reset();

    this.loadedObject = object;
    this.animations = animations;
    this.name = name;

    if (this.loadingManagerOnLoadCalled === true) {
      exportGLTF.setInput(this.loadedObject, this.animations, this.name);
      this.setUpExporter = true;
    }
  }
}
export default new Main(HTMLControl.originalCanvas, HTMLControl.resultCanvas);
