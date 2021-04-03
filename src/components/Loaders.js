import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";
import { AMFLoader } from "three/examples/jsm/loaders/AMFLoader.js";
// import { BufferGeometryLoader } from "three/examples/jsm/loaders/BufferGeometryLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
// import { ObjectLoader } from "three/examples/jsm/loaders/ObjectLoader.js";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader.js";
import { PDBLoader } from "three/examples/jsm/loaders/PDBLoader.js";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
import { PRWMLoader } from "three/examples/jsm/loaders/PRWMLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader.js";

import promisifyLoader from "../utilities/promisifyLoader.js";
import loadingManager from "./loadingManager.js";

// TODO
// import loadJavascript from '../utilities/loadJavascript.js';

// Removed for now
// Loader.Handlers.add( /\.dds$/i, new DDSLoader() );

let bufferGeometryLoader = null;
let amfLoader = null;
let colladaLoader = null;
// let ctmLoader = null;
// let dracoLoader = null;
let fbxLoader = null;
let gltfLoader = null;
let jsonLoader = null;
// let kmzLoader = null;
// let legacyGltfLoader = null;
// let mmdLoader = null;
let mtlLoader = null;
// let nrrdLoader = null;
// let objectLoader = null;
let objLoader = null;
let pcdLoader = null;
let pdbLoader = null;
let plyLoader = null;
let pwrmLoader = null;
let stlLoader = null;
let threemfLoader = null;

// used for passing materials to objLoader
let objLoaderInternal = null;

class Loaders {
  constructor() {
    return {
      get amfLoader() {
        if (amfLoader === null) {
          amfLoader = promisifyLoader(
            new AMFLoader(loadingManager),
            loadingManager
          );
        }
        return amfLoader;
      },

      // get bufferGeometryLoader() {
      //   if (bufferGeometryLoader === null) {
      //     bufferGeometryLoader = promisifyLoader(
      //       new BufferGeometryLoader(loadingManager),
      //       loadingManager
      //     );
      //   }
      //   return bufferGeometryLoader;
      // },

      get colladaLoader() {
        if (colladaLoader === null) {
          colladaLoader = promisifyLoader(
            new ColladaLoader(loadingManager),
            loadingManager
          );
        }
        return colladaLoader;
      },

      // ctmLoader
      // get loaderName() {
      //   if ( loaderName === null ) {
      //     loaderName = promisifyLoader( new CAPLoader( loadingManager ), loadingManager );
      //   }
      //   return loaderName;
      // },

      // dracoLoader
      // get loaderName() {
      //   if ( loaderName === null ) {
      //     loaderName = promisifyLoader( new CAPLoader( loadingManager ), loadingManager );
      //   }
      //   return loaderName;
      // },

      // TODO: testing lazy load JS
      // get fbxLoader() {

      //   loadJavascript( '/js/vendor/three/examples/js/loaders/FBXLoader.min.js' ).then( () => {

      //     if ( fbxLoader === null ) fbxLoader = promisifyLoader( new FBXLoader( loadingManager ), loadingManager );

      //     return fbxLoader;

      //   } ).catch( ( err ) => { console.error( err ); } );

      // },

      get fbxLoader() {
        if (fbxLoader === null) {
          fbxLoader = promisifyLoader(
            new FBXLoader(loadingManager),
            loadingManager
          );
        }
        return fbxLoader;
      },

      get gltfLoader() {
        if (gltfLoader === null) {
          gltfLoader = promisifyLoader(
            new GLTFLoader(loadingManager),
            loadingManager
          );
        }
        return gltfLoader;
      },

      get jsonLoader() {
        if (jsonLoader === null) {
          jsonLoader = promisifyLoader(
            new JSONLoader(loadingManager),
            loadingManager
          );
        }
        return jsonLoader;
      },

      // kmzLoader
      // get loaderName() {
      //   if ( loaderName === null ) {
      //     loaderName = promisifyLoader( new CAPLoader( loadingManager ), loadingManager );
      //   }
      //   return loaderName;
      // },

      // mmdLoader
      // get loaderName() {
      //   if ( loaderName === null ) {
      //     loaderName = promisifyLoader( new CAPLoader( loadingManager ), loadingManager );
      //   }
      //   return loaderName;
      // },

      get mtlLoader() {
        if (mtlLoader === null) {
          mtlLoader = promisifyLoader(
            new MTLLoader(loadingManager),
            loadingManager
          );
        }
        return mtlLoader;
      },

      // nrrdLoader
      // get loaderName() {
      //   if ( loaderName === null ) {
      //     loaderName = promisifyLoader( new NRRDLoader( loadingManager ), loadingManager );
      //   }
      //   return loaderName;
      // },

      // get objectLoader() {
      //   if (objectLoader === null) {
      //     objectLoader = promisifyLoader(
      //       new ObjectLoader(loadingManager),
      //       loadingManager
      //     );
      //   }
      //   return objectLoader;
      // },

      get objLoader() {
        if (objLoaderInternal === null) {
          objLoaderInternal = new OBJLoader(loadingManager);

          objLoader = promisifyLoader(objLoaderInternal, loadingManager);

          objLoader.setMaterials = (materials) => {
            objLoaderInternal.setMaterials(materials);
          };
        }

        return objLoader;
      },

      get pcdLoader() {
        if (pcdLoader === null) {
          pcdLoader = promisifyLoader(
            new PCDLoader(loadingManager),
            loadingManager
          );
        }
        return pcdLoader;
      },

      get pdbLoader() {
        if (pdbLoader === null) {
          pdbLoader = promisifyLoader(
            new PDBLoader(loadingManager),
            loadingManager
          );
        }
        return pdbLoader;
      },

      get plyLoader() {
        if (plyLoader === null) {
          plyLoader = promisifyLoader(
            new PLYLoader(loadingManager),
            loadingManager
          );
        }
        return plyLoader;
      },

      get pwrmLoader() {
        if (pwrmLoader === null) {
          pwrmLoader = promisifyLoader(
            new PRWMLoader(loadingManager),
            loadingManager
          );
        }
        return pwrmLoader;
      },

      get stlLoader() {
        if (stlLoader === null) {
          stlLoader = promisifyLoader(
            new STLLoader(loadingManager),
            loadingManager
          );
        }
        return stlLoader;
      },

      get threemfLoader() {
        if (threemfLoader === null) {
          threemfLoader = promisifyLoader(
            new ThreeMFLoader(loadingManager),
            loadingManager
          );
        }
        return threemfLoader;
      },
    };
  }
}

export default new Loaders();
