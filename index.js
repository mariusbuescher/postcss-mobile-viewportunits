var postcss = require( 'postcss' );
var matchMedia = require( 'css-mediaquery' ).match;

var mobileViewportunits = postcss.plugin( 'postcss-mobile-viewportunits', function( opts ) {
    opts = opts !== undefined ? opts : {
        devices: [
            // iPad
            {
                mediaquery: 'only screen and (-webkit-min-device-pixel-ratio: 1) and (device-width: 768px) and (device-height: 1024px) and (orientation: portrait)',
                width: 768,
                height: 1024
            },
            {
                mediaquery: 'only screen and (-webkit-min-device-pixel-ratio: 1) and (device-width: 768px) and (device-height: 1024px) and (orientation: landscape)',
                width: 1024,
                height: 768
            },

            // iPhone 4
            {
                mediaquery: 'only screen and (-webkit-min-device-pixel-ratio: 1) and (device-width: 320px) and (device-height: 480px) and (orientation: portrait)',
                width: 320,
                height: 480
            },
            {
                mediaquery: 'only screen and (-webkit-min-device-pixel-ratio: 1) and (device-width: 320px) and (device-height: 480px) and (orientation: landscape)',
                width: 480,
                height: 320
            },

            // iPhone 5, 5C, 5S
            {
                mediaquery: 'only screen and (-webkit-min-device-pixel-ratio: 1) and (device-width: 320px) and (device-height: 568px) and (orientation: portrait)',
                width: 320,
                height: 568
            },
            {
                mediaquery: 'only screen and (-webkit-min-device-pixel-ratio: 1) and (device-width: 320px) and (device-height: 568px) and (orientation: landscape)',
                width: 568,
                height: 320
            }
        ]
    };

    return function( css, result ) {
        var rules = {};
        css.walkDecls( function( decl ) {
            if ( decl.value.match(/(vh|vw|vmin|vmax)/) ) {

                var selector = decl.parent.selector;
                var declMq = decl.parent.parent.type === 'atrule' ? decl.parent.parent.params : false

                opts.devices.forEach( function( device ) {
                    if (declMq !== false) {
                        var deviceMatches = matchMedia(declMq, {
                            width: device.width + 'px',
                            height: device.height + 'px'
                        } );

                        if (deviceMatches !== true) {
                            return;
                        }
                    }

                    var value = decl.value.replace(/(\d+)(vh|vw|vmin|vmax)/gi, function( fullUnit, value, unit) {
                        var relativeValue = Number(value) / 100;
                        var multiplier;
                        if ( unit === 'vmin' ) {
                            multiplier = (device.width > device.height) ? device.height : device.width;
                        } else if ( unit === 'vmax' ) {
                            multiplier = (device.width > device.height) ? device.width : device.height;
                        } else {
                            multiplier = (unit === 'vw') ? device.width : device.height;
                        }

                        return (relativeValue * multiplier) + 'px';
                    } );

                    var mediaquery = device.mediaquery;
                        mediaquery += (declMq) ? ' and ' + declMq : '';

                    if ( !rules[ mediaquery ] ) {
                        rules[ mediaquery ] = {};
                    }

                    if ( Array.isArray( rules[ mediaquery ][ selector ] ) === false ) {
                        rules[ mediaquery ][ selector ] = [];
                    }

                    var newDecl = decl.clone( {
                        value: value
                    } );

                    rules[ mediaquery ][ selector ].push( newDecl );
                } );
            }
        } );

        for (var atrule in rules) {
            var selectors = rules[ atrule ];
            var newAtRule = postcss.atRule( {
                name: 'media',
                params: atrule
            } );

            for ( var selector in selectors ) {
                var declsInTree = [];

                var newRule = postcss.rule( {
                    selector: selector
                } );

                selectors[ selector ].forEach( function( decl ) {
                    var matchingDecls = declsInTree.filter(function ( tDecl ) {
                        return decl.prop  === tDecl.prop && decl.value === tDecl.value;
                    });

                    if (matchingDecls.length === 0) {
                        declsInTree.push(decl);
                        newRule.append( decl );
                    }
                } );

                newAtRule.append( newRule );
            }

            result.root.prepend( newAtRule );
        }

    };
} );

module.exports = mobileViewportunits;
