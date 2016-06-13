var postcss = require( 'postcss' );

postcss( [
    require( './index.js' )()
] ).process( '.selector {\n' +
        '\twidth: 100vh;\n' +
        '\tmargin: calc(50vw - 10px);\n' +
        '\theight: 10px;\n' +
    '}\n\n' +
    '@media (min-width: 360px) {\n' +
        '\t.selector .foo {\n' +
            '\t\twidth: 80vmin;\n' +
        '}\n' +
    '}\n\n' +
    '@media (min-width: 680px) {\n' +
        '\t.selector .foo {\n'+
            '\t\twidth: calc(50vmax - 1vmin);\n' +
        '\t}\n' +
    '}' ).then(function( result ) {
    console.log( result.css );
} );
