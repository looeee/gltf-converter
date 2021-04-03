import HTMLControl from '../HTMLControl.js';

const clearChildren = ( object ) => {

  for ( let i = 0; i < object.children.length; i++ ) {

    let child = object.children[ i ];

    object.remove( child );
    child = null;

  }

};

export default ( loadedModels ) => {

  HTMLControl.setInitialState();

  clearChildren( loadedModels );

};
