import { LoadingManager } from "three";

import HTMLControl from "../HTMLControl.js";

const loadingManager = new LoadingManager();

let percentComplete = 0;

let timerID = null;

// hide the upload form when loading starts so that the progress bar can be shown
loadingManager.onStart = () => {
  // prevent onStart being called multiple times
  // if ( timerID !== null ) return;
  HTMLControl.setOnLoadStartState();

  timerID = setInterval(() => {
    percentComplete += 5;

    if (percentComplete >= 100) {
      clearInterval(timerID);
    } else {
      HTMLControl.loading.original.progress.style.width = percentComplete + "%";
    }
  }, 100);
};

// loadingManager.onLoad = function ( ) {

//   console.log( 'loadingManager.onLoad ' )

//   HTMLControl.setOnLoadEndState();
//   clearInterval( timerID );

// };

loadingManager.onProgress = () => {
  if (percentComplete >= 100) return;

  percentComplete += 1;

  HTMLControl.loading.original.progress.style.width = percentComplete + "%";
};

loadingManager.onError = (msg) => {
  console.error(msg);
};

export default loadingManager;
