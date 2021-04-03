import { Box3, PerspectiveCamera, Scene, WebGLRenderer, Vector3 } from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import Time from "./Time.js";

/**
 * @author Lewy Blue / https://github.com/looeee
 *
 */

function App(canvas) {
  let _scene;
  let _camera;
  let _renderer;

  let _currentAnimationFrameID;

  const self = this;

  if (canvas !== undefined) this.canvas = canvas;
  else console.warn("Canvas is undefined! ");

  this.autoRender = true;

  this.autoResize = true;

  this.frameCount = 0;

  this.delta = 0;

  this.isPlaying = false;
  this.isPaused = false;

  this.time = new Time();

  const setRendererSize = function () {
    if (_renderer)
      _renderer.setSize(
        self.canvas.clientWidth,
        self.canvas.clientHeight,
        false
      );
  };

  const setCameraAspect = function () {
    if (_camera) {
      _camera.aspect = self.canvas.clientWidth / self.canvas.clientHeight;
      _camera.updateProjectionMatrix();
    }
  };

  // note: gets called last when autoResize is on
  this.onWindowResize = function () {};

  const onWindowResize = function () {
    if (!self.autoResize) {
      self.onWindowResize();
      return;
    }

    // don't do anything if the camera doesn't exist yet
    if (!_camera) return;

    if (_camera.type !== "PerspectiveCamera") {
      console.warn("App: AutoResize only works with PerspectiveCamera");
      return;
    }

    setCameraAspect();

    setRendererSize();

    self.onWindowResize();
  };

  window.addEventListener("resize", onWindowResize, false);

  Object.defineProperties(this, {
    camera: {
      get() {
        if (_camera === undefined) {
          _camera = new PerspectiveCamera(
            50,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
          );
        }

        return _camera;
      },

      set(camera) {
        _camera = camera;
        setCameraAspect();
      },
    },

    scene: {
      get() {
        if (_scene === undefined) {
          _scene = new Scene();
        }

        return _scene;
      },

      set(scene) {
        _scene = scene;
      },
    },

    renderer: {
      get() {
        if (_renderer === undefined) {
          _renderer = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
          });
          _renderer.setPixelRatio(window.devicePixelRatio);
          _renderer.setSize(
            this.canvas.clientWidth,
            this.canvas.clientHeight,
            false
          );
        }

        return _renderer;
      },

      set(renderer) {
        _renderer = renderer;
        setRendererSize();
      },
    },

    averageFrameTime: {
      get() {
        return this.frameCount !== 0
          ? this.time.unscaledTotalTime / this.frameCount
          : 0;
      },
    },
  });

  this.play = function () {
    this.time.start();

    this.isPlaying = true;
    this.isPaused = false;

    function animationHandler() {
      self.frameCount++;
      self.delta = self.time.delta;

      self.onUpdate();

      if (self.controls && self.controls.enableDamping) self.controls.update();

      if (self.autoRender) self.renderer.render(self.scene, self.camera);

      _currentAnimationFrameID = requestAnimationFrame(() => {
        animationHandler();
      });
    }

    animationHandler();
  };

  this.pause = function () {
    this.isPaused = true;

    this.time.pause();

    cancelAnimationFrame(_currentAnimationFrameID);
  };

  this.stop = function () {
    this.isPlaying = false;
    this.isPaused = false;

    this.time.stop();
    this.frameCount = 0;

    cancelAnimationFrame(_currentAnimationFrameID);
  };

  this.onUpdate = function () {};

  this.initControls = function () {
    this.controls = new OrbitControls(this.camera, this.canvas);

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.2;
  };

  this.fitCameraToObject = function (object, zoom) {
    zoom = zoom || 1;

    const boundingBox = new Box3();

    // get bounding box of object - this will be used to setup controls and camera
    boundingBox.setFromObject(object);

    const center = boundingBox.getCenter(new Vector3());
    const size = boundingBox.getSize(new Vector3());

    // get the max side of the bounding box
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2));

    cameraZ *= zoom; // zoom out a little so that objects don't fill the screen

    const minZ = boundingBox.min.z;
    const cameraToFarEdge = -minZ + cameraZ;

    const far = cameraToFarEdge * 3;
    this.camera.far = far;

    // camera near needs to be set to accommodate tiny objects
    // but not cause artefacts for large objects
    if (far < 1) this.camera.near = 0.001;
    else if (far < 100) this.camera.near = 0.01;
    else if (far < 500) this.camera.near = 0.1;
    // else if ( far < 1000 ) this.camera.near = 1;
    else this.camera.near = 1;

    // set camera to rotate around center of loaded object
    this.controls.target.copy(center);

    // // prevent camera from zooming out far enough to create far plane cutoff
    this.controls.maxDistance = cameraToFarEdge * 2;

    this.camera.position.set(center.x, size.y, cameraZ);

    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.controls.saveState();

    return boundingBox;
  };
}

export default App;
