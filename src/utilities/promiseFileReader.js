export default function readFileAs( file, as ) {
  if ( !( file instanceof Blob ) ) {
    throw new TypeError( 'Must be a File or Blob' );
  }
  return new Promise( ( ( resolve, reject ) => {
    const reader = new FileReader();
    reader.onload = function ( e ) { resolve( e.target.result ); };
    reader.onerror = function ( e ) { reject( new Error( 'Error reading' + file.name + ': ' + e.target.result ) ); };
    reader['readAs' + as]( file );
  } ) );
}
