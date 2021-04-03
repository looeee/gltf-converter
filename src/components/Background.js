import {
  Color,
  RepeatWrapping,
  PlaneBufferGeometry,
  Mesh,
  TextureLoader,
  RawShaderMaterial,
  NeverDepth,
} from "three";

import HTMLControl from "../HTMLControl.js";
import backgroundVert from "../shaders/background.vert";
import backgroundFrag from "../shaders/background.frag";

export default class Background {
  constructor(app) {
    this.app = app;

    this.initMaterials();
    this.initMesh();
    this.initButton();

    // this.lightControls();
  }

  initMesh() {
    const geometry = new PlaneBufferGeometry(2, 2, 1);
    const mesh = new Mesh(geometry, this.mat);

    this.app.camera.add(mesh);
  }

  initMaterials() {
    const loader = new TextureLoader();
    const noiseTexture = loader.load("/assets/noise-256.jpg");
    noiseTexture.wrapS = noiseTexture.wrapT = RepeatWrapping;

    this.colA = new Color(0xffffff);
    this.colB = new Color(0x283844);

    const uniforms = {
      color1: { value: this.colA },
      color2: { value: this.colB },
      noiseTexture: { value: noiseTexture },
      vignetteAmount: { value: 0 },
      mixAmount: { value: 0.08 },
    };

    this.mat = new RawShaderMaterial({
      uniforms,
      // depthTest: false,
      // depthWrite: false,
      depthFunc: NeverDepth,
      vertexShader: backgroundVert,
      fragmentShader: backgroundFrag,
    });
  }

  initButton() {
    let dark = true;

    // HTMLControl.controls.toggleBackground.addEventListener( 'click', ( e ) => {

    //   e.preventDefault();
    if (!dark) {
      this.mat.uniforms.mixAmount.value = 0.8;
      this.mat.uniforms.vignetteAmount.value = -1.6;
      // this.colA.set( 0x283844 );
      // this.colB.set( 0xffffff );

      // this.darkControls();
    } else {
      this.mat.uniforms.mixAmount.value = 0.08;
      this.mat.uniforms.vignetteAmount.value = 0;
      // this.colA.set( 0xffffff );
      // this.colB.set( 0x283844 );

      // this.lightControls();
    }

    dark = !dark;

    // }, false );
  }
}
