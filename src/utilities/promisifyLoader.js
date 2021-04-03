// import loadingManager from '../loadingManager.js';

const promisifyLoader = ( loader, manager ) => {
  return ( url, parse = false ) => {

    return new Promise( ( resolve, reject ) => {

      if ( parse === true ) loader.parse( url, '', resolve, reject );
      else loader.load( url, resolve, manager.onProgress, reject );

    } );

  };
}

export default promisifyLoader;