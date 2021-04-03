import HTMLControl from '../HTMLControl.js';

const goFullscreen = ( elem ) => {

  if ( !document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
    if ( elem.requestFullscreen ) {
      elem.requestFullscreen();
    } else if ( elem.msRequestFullscreen ) {
      elem.msRequestFullscreen();
    } else if ( elem.mozRequestFullScreen ) {
      elem.mozRequestFullScreen();
    } else if ( elem.webkitRequestFullscreen ) {
      elem.webkitRequestFullscreen();
    }
  } else if ( document.exitFullscreen ) {
    document.exitFullscreen();
  } else if ( document.msExitFullscreen ) {
    document.msExitFullscreen();
  } else if ( document.mozCancelFullScreen ) {
    document.mozCancelFullScreen();
  } else if ( document.webkitExitFullscreen ) {
    document.webkitExitFullscreen();
  }

};

HTMLControl.fullscreenButton.addEventListener( 'click', ( e ) => {

  e.preventDefault();
  goFullscreen( HTMLControl.previews );

}, false );
