import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

import HTMLControl from "../HTMLControl.js";
import main from "../main.js";
import loaders from "./Loaders.js";

// saving function taken from three.js editor
const link = document.createElement("a");
link.style.display = "none";
document.body.appendChild(link); // Firefox workaround, see #6594

const save = (blob, filename) => {
  link.href = URL.createObjectURL(blob);
  link.download = filename || "data.json";
  link.click();
};

const saveString = (text, filename) => {
  save(new Blob([text], { type: "text/plain" }), filename);
};

const saveArrayBuffer = (buffer, filename) => {
  save(new Blob([buffer], { type: "application/octet-stream" }), filename);
};

const stringByteLength = (str) => {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--; // trail surrogate
  }

  return s;
};

class ExportGLTF {
  constructor() {
    this.loader = loaders.gltfLoader;

    this.sizeInfo = "";

    this.exporter = new GLTFExporter();
    this.initExportButton();
    this.initOptionListeners();
  }

  getOptions() {
    const options = {
      binary: HTMLControl.controls.binary.checked,
      animations: HTMLControl.controls.animations.checked,
      onlyVisible: HTMLControl.controls.onlyVisible.checked,
      embedImages: HTMLControl.controls.embedImages.checked,
      forceIndices: HTMLControl.controls.forceIndices.checked,
      truncateDrawRange: false, // probably can't load models with drawrange defined
      trs: false,
      forcePowerOfTwoTextures: true, // facebook compatibility
    };

    if (options.animations && this.animations && this.animations.length > 0)
      options.animations = this.animations;

    return options;
  }

  setInput(input, animations, name) {
    this.input = input;
    this.animations = animations;
    this.name = name;
    this.parse();
  }

  parse() {
    this.exporter.parse(
      this.input,
      (result) => {
        this.result = result;
        this.processResult(result);
      },
      this.getOptions()
    );
  }

  loadPreview() {
    main.resultPreview.reset();

    const promise = loaders.gltfLoader(this.output, true);

    promise
      .then((gltf) => {
        HTMLControl.loading.result.overlay.classList.add("hide");
        HTMLControl.controls.exportGLTF.disabled = false;

        if (gltf.scenes.length > 1) {
          gltf.scenes.forEach((scene) => {
            if (gltf.animations) scene.animations = gltf.animations;
            main.resultPreview.addObjectToScene(scene);
          });
        } else if (gltf.scene) {
          if (gltf.animations) gltf.scene.animations = gltf.animations;
          main.resultPreview.addObjectToScene(gltf.scene);
        }
      })
      .catch((err) => {
        console.log(err);
        HTMLControl.loading.result.overlay.classList.remove("hide");
        HTMLControl.controls.exportGLTF.disabled = true;
      });
  }
  processResult() {
    this.setOutput();
    this.loadPreview();
  }

  updateInfo(byteLength) {
    const type = HTMLControl.controls.binary.checked ? "GLB" : "GLTF";

    if (byteLength) {
      this.sizeInfo =
        byteLength < 1000000
          ? " (" + Math.ceil(byteLength * 0.001) + "kb)"
          : " (" + (byteLength * 1e-6).toFixed(3) + "mb)";
    }

    HTMLControl.controls.formatLabel.innerHTML =
      type === "GLB" ? "Binary (.glb)" : "ASCII (.gltf)";

    HTMLControl.controls.exportGLTF.value = "Export as " + type + this.sizeInfo;
  }

  setOutput() {
    if (this.result instanceof ArrayBuffer) {
      this.output = this.result;
      this.updateInfo(this.result.byteLength);
    } else {
      this.output = JSON.stringify(this.result, null, 2);
      this.updateInfo(stringByteLength(this.output));
    }
  }

  save() {
    if (this.output instanceof ArrayBuffer) {
      saveArrayBuffer(this.result, this.name + ".glb");
    } else {
      saveString(this.output, this.name + ".gltf");
    }
  }
  initExportButton() {
    HTMLControl.controls.exportGLTF.addEventListener("click", (e) => {
      e.preventDefault();

      if (this.output) this.save(this.output);
    });
  }

  initOptionListeners() {
    const onOptionChange = (e) => {
      e.preventDefault();
      this.updateInfo();

      if (this.input === undefined) return;

      this.parse();
    };

    HTMLControl.controls.binary.addEventListener(
      "change",
      onOptionChange,
      false
    );
    HTMLControl.controls.animations.addEventListener(
      "change",
      onOptionChange,
      false
    );
    HTMLControl.controls.onlyVisible.addEventListener(
      "change",
      onOptionChange,
      false
    );
    HTMLControl.controls.embedImages.addEventListener(
      "change",
      onOptionChange,
      false
    );
    HTMLControl.controls.forceIndices.addEventListener(
      "change",
      onOptionChange,
      false
    );
  }
}

export default new ExportGLTF();
