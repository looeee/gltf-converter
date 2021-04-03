const originalCanvas = document.querySelector( '#original-preview-canvas' );
const resultCanvas = document.querySelector( '#result-preview-canvas' );
const previews = document.querySelector( '#previews' );

const fullscreenButton = document.querySelector( '#fullscreen-button' );

const messages = document.querySelector( '#messages' );
const errors = document.querySelector( '#errors' );
const errorsContainer = document.querySelector( '#errors-container' );
const warnings = document.querySelector( '#warnings' );
const warningsContainer = document.querySelector( '#warnings-container' );
const logs = document.querySelector( '#logs' );
const logsContainer = document.querySelector( '#logs-container' );

const fileUpload = {
  input: document.querySelector( '#file-upload-input' ),
  button: document.querySelector( '#file-upload-button' ),
  form: document.querySelector( '#file-upload-form' ),
};

const loading = {
  original: {
    bar: document.querySelector( '#original-loading-bar' ),
    overlay: document.querySelector( '#original-loading-overlay' ),
    progress: document.querySelector( '#original-progress' ),
  },
  result: {
    bar: document.querySelector( '#result-loading-bar' ),
    overlay: document.querySelector( '#result-loading-overlay' ),
    progress: document.querySelector( '#result-progress' ),
  },
};

const controls = {
  onlyVisible: document.querySelector( '#option_visible' ),
  binary: document.querySelector( '#option_binary' ),
  embedImages: document.querySelector( '#option_embedImages' ),
  animations: document.querySelector( '#option_animations' ),
  forceIndices: document.querySelector( '#option_forceindices' ),
  exportGLTF: document.querySelector( '#export' ),
  formatLabel: document.querySelector( '#format_label' ),
};

export default class HTMLControl {
  static setInitialState() {

    controls.exportGLTF.disabled = true;
    loading.original.overlay.classList.remove( 'hide' );
    loading.result.overlay.classList.remove( 'hide' );
    loading.original.bar.classList.add( 'hide' );
    loading.original.progress.style.width = 0;
    loading.result.bar.classList.add( 'hide' );
    loading.result.progress.style.width = 0;

  }

  static setOnLoadStartState() {

    controls.exportGLTF.disabled = true;
    loading.result.overlay.classList.remove( 'hide' );
    loading.original.bar.classList.remove( 'hide' );
    messages.classList.add( 'hide' );
    errorsContainer.classList.add( 'hide' );
    warningsContainer.classList.add( 'hide' );
    logsContainer.classList.add( 'hide' );
    errors.innerHTML = '';
    warnings.innerHTML = '';
    logs.innerHTML = '';

  }


  static setOnLoadEndState() {

    loading.original.overlay.classList.add( 'hide' );

  }

}

HTMLControl.originalCanvas = originalCanvas;
HTMLControl.resultCanvas = resultCanvas;
HTMLControl.fileUpload = fileUpload;
HTMLControl.loading = loading;
HTMLControl.controls = controls;
HTMLControl.previews = previews;
HTMLControl.fullscreenButton = fullscreenButton;
HTMLControl.messages = messages;
HTMLControl.errorsContainer = errorsContainer;
HTMLControl.errors = errors;
HTMLControl.warningsContainer = warningsContainer;
HTMLControl.warnings = warnings;
HTMLControl.logsContainer = logsContainer;
HTMLControl.logs = logs;
