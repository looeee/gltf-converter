import HTMLControl from '../HTMLControl.js';

const originalError = console.warn.bind( console );

function log( ...args ) {

  const rep = args.slice( 1, args.length );
  let i = 0;

  if ( typeof args[0] === 'string' ) {

    const output = args[0].replace( /%s/g, ( match, idx ) => {
      const subst = rep.slice( i, ++i );
      return ( subst );
    } );

    return output;

  }

  return args[0];

}
console.error = ( ...args ) => {

  const msg = log( ...args );

  if ( !msg ) return;

  HTMLControl.messages.classList.remove( 'hide' );
  HTMLControl.errorsContainer.classList.remove( 'hide' );
  const p = document.createElement( 'p' );
  p.innerHTML = msg;
  HTMLControl.errors.append( p );

  originalError( ...args );

};

const originalWarn = console.warn.bind( console );

console.warn = ( ...args ) => {

  const msg = log( ...args );

  if ( !msg ) return;

  HTMLControl.messages.classList.remove( 'hide' );
  HTMLControl.warningsContainer.classList.remove( 'hide' );
  const p = document.createElement( 'p' );
  p.innerHTML = msg;
  HTMLControl.warnings.append( p );

  originalWarn( ...args );

};

const originalLog = console.log.bind( console );

console.log = ( ...args ) => {

  const msg = log( ...args );

  if ( !msg ) return;

  if ( typeof msg.indexOf === 'function' ) {
    if(
      msg.indexOf( 'THREE.WebGLRenderer' ) !== -1
      || msg.indexOf( '[object Object]' )
    ) return;
  }

  HTMLControl.messages.classList.remove( 'hide' );
  HTMLControl.logsContainer.classList.remove( 'hide' );
  const p = document.createElement( 'p' );
  p.innerHTML = msg;
  HTMLControl.logs.append( p );

  originalLog( ...args );

};
