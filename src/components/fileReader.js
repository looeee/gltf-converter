import loadingManager from './loadingManager.js';
import loaders from './Loaders.js';
import HTMLControl from '../HTMLControl.js';
import readFileAs from '../utilities/promiseFileReader.js';
import main from '../main.js';

// Check support for the File API support
const checkForFileAPI = () => {

  if ( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {

    console.error( 'This loader requires the File API. Please upgrade your browser' );

  }

};

checkForFileAPI();

const isAsset = type => new RegExp( '(bin|bmp|frag|gif|jpeg|jpg|mtl|png|svg|vert)$' ).test( type );

const isModel = type => new RegExp( '(3mf|amf|ctm|dae|drc|fbx|gltf|glb|js|json|kmz|mmd|nrrd|obj|pcd|pdb|ply|pwrm|stl)$' ).test( type );

const isValid = type => isAsset( type ) || isModel( type );

let models = [];
let assets = {};
let promises = [];

const selectJSONLoader = ( file, name, originalFile ) => {
  const json = JSON.parse( file );

  if ( json.metadata ) {

    let type = '';
    if ( json.metadata.type ) type = json.metadata.type.toLowerCase();

    readFileAs( originalFile, 'DataURL' ).then( ( data ) => {

      if ( type === 'buffergeometry' ) main.load( loaders.bufferGeometryLoader( data ), name );
      else if ( type === 'object' ) main.load( loaders.objectLoader( data ), name );
      else main.load( loaders.jsonLoader( data ), name );

    } ).catch( err => console.error( err ) );

  } else {

    console.error( 'Error: Invalid JSON file.' );

  }

};

const loadFile = ( details ) => {

  const file = details[ 0 ];
  const name = details[ 1 ];
  const type = details[ 2 ];
  const originalFile = details[ 3 ];

  switch ( type ) {

    case '3mf':
      main.load( loaders.threemfLoader( file ), name );
      break;
    case 'amf':
      main.load( loaders.amfLoader( file ), name );
      break;
    case 'ctm':
      console.log( 'Support for ' + type + ' coming soon!' );
      // main.load( loaders.ctmLoader( file ), name );
      break;
    case 'dae':
      main.load( loaders.colladaLoader( file ), name );
      break;
    case 'drc':
      console.log( 'Support for ' + type + ' coming soon!' );
      // main.load( loaders.dracoLoader( file ), name );
      break;
    case 'fbx':
      main.load( loaders.fbxLoader( file ), name );
      break;
    case 'gltf':
    case 'glb':
      main.load( loaders.gltfLoader( file ), name, file );
      break;
    case 'json':
    case 'js':
      selectJSONLoader( file, name, originalFile );
      break;
    case 'kmz':
      console.log( 'Support for ' + type + ' coming soon!' );
      // main.load( loaders.kmzLoader( file ), name );
      break;
    case 'mmd':
      // console.log( 'Support for ' + type + ' coming soon!' );
      // main.load( loaders.mmdLoader( file ), name );
      break;
    case 'nrrd':
      console.log( 'Support for ' + type + ' coming soon!' );
      // main.load( loaders.nrrdLoader( file ), name );
      break;
    case 'obj':
      loaders.mtlLoader( assets[originalFile.name.replace( '.obj', '.mtl' ) ] )
        .then( ( materials ) => {

          loaders.objLoader.setMaterials( materials );
          return main.load( loaders.objLoader( file ), name );

        } ).catch( err => console.error( err ) );
      break;
    case 'pcd':
      main.load( loaders.pcdLoader( file ), name );
      break;
    case 'pdb':
      console.log( 'Support for ' + type + ' coming soon!' );
      // main.load( loaders.pdbLoader( file ), name );
      break;
    case 'ply':
      main.load( loaders.plyLoader( file ), name );
      break;
    case 'pwrm':
      console.log( 'Support for ' + type + ' coming soon!' );
      // main.load( loaders.pwrmLoader( file ), name );
      break;
    case 'stl':
      // console.log( 'Support for ' + type + ' coming soon!' );
      main.load( loaders.stlLoader( file ), name );
      break;
    default:
      console.error( 'Unsupported file type ' + type + ' - please load one of the supported model formats.' );
  }

};

loadingManager.setURLModifier( ( url ) => {

  if ( url[ url.length - 3 ] === '.' || url[ url.length - 4 ] === '.' ) {

    const type = url.split( '.' ).pop().toLowerCase();

    if ( isAsset( type ) ) {

      url = url.replace( 'data:application/', '' );
      url = url.split( '/' );
      url = url[ url.length - 1 ];

    }

  }

  if ( assets[ url ] === undefined ) return url;
  return assets[ url ];

} );

const processFile = ( file ) => {

  const name = file.name.split( '/' ).pop().split( '.' )[0];
  const type = file.name.split( '.' ).pop().toLowerCase();

  if ( !isValid( type ) ) return;

  if ( type === 'js' || type === 'json' ) {

    const promise = readFileAs( file, 'Text' )
      .then( ( data ) => { models.push( [ data, name, type, file ] ); } )
      .catch( err => console.error( err ) );

    promises.push( promise );

  } else {

    const promise = readFileAs( file, 'DataURL' )
      .then( ( data ) => {

        if ( isModel( type ) ) {

          if ( type === 'obj' ) models.push( [ data, name, type, file ] );
          else models.push( [ data, name, type ] );

        } else if ( isAsset( type ) ) {

          assets[ file.name ] = data;

        }

      } ).catch( err => console.error( err ) );

    promises.push( promise );

  }


};

const processFiles = ( files ) => {

  models = [];
  assets = {};
  promises = [];

  for ( let i = 0; i < files.length; i++ ) {

    processFile( files[ i ] );

  }

  Promise.all( promises )
    .then( () => {

      models.forEach( model => loadFile( model ) );

    } ).catch( err => console.error( err ) );

};

const form = HTMLControl.fileUpload.form;
const button = HTMLControl.fileUpload.button;

button.addEventListener( 'click', ( e ) => {

  e.preventDefault();
  HTMLControl.fileUpload.input.click();

}, false );

HTMLControl.fileUpload.input.addEventListener( 'change', ( e ) => {

  e.preventDefault();

  const files = e.target.files;

  processFiles( files );

}, false );

['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( event => form.addEventListener( event, ( e ) => {

  e.preventDefault();
  e.stopPropagation();

} ) );

['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( event => document.addEventListener( event, ( e ) => {

  e.preventDefault();
  e.stopPropagation();

} ) );

['dragover', 'dragenter'].forEach( event => form.addEventListener( event, () => {

  // form.classList.add( 'border' );
  button.style.background = '#B82601';

} ) );

['dragend', 'dragleave', 'drop'].forEach( event => form.addEventListener( event, () => {

  // form.classList.remove( 'border' );
  button.style.background = '#062f4f';

} ) );

HTMLControl.fileUpload.form.addEventListener( 'drop', ( e ) => {

  const files = e.dataTransfer.files;

  processFiles( files );

} );
