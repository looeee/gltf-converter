// TODO: https://davidwalsh.name/javascript-loader

const cache = {};

const loadJavascript = ( src ) => {
  return new Promise( ( resolve, reject ) => {

    if ( cache[ src ] === true ) resolve();
    else {
      cache[ src ] = true;
      const script = document.createElement( 'script' );
      script.setAttribute( 'type', 'text/javascript' );
      script.setAttribute( 'src', src );
      document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );

      console.log( 'loading: ' + src );
      script.onload = ( e ) => {
        resolve();
      };

      script.onerror = ( e ) => {
        console.log( 'failed' );
        reject( console.error( 'Couldn\'t read file: ' + src ) );
      };
    }

  } );
};

// const loadJavascript = ( src ) => {

//   return new Promise( ( resolve, reject ) => {

//     const script = document.createElement( 'script' );

//   } );

// }

export default loadJavascript;
