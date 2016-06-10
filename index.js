var postcss = require( 'postcss' );
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
            if ( decl.value.match(/(vh|vw)/) ) {

                var selector = decl.parent.selector;

                opts.devices.forEach( function( device ) {
                    var value = decl.value.replace(/(\d+)(vh|vw)/gi, function( fullUnit, value, unit) {
                        var relativeValue = Number(value) / 100;
                        var multiplier = (unit === 'vw') ? device.width : device.height;

                        return (relativeValue * multiplier) + 'px';
                    } );

                    if ( !rules[ device.mediaquery ] ) {
                        rules[ device.mediaquery ] = {};
                    }

                    if ( Array.isArray( rules[ device.mediaquery ][ selector ] ) === false ) {
                        rules[ device.mediaquery ][ selector ] = [];
                    }

                    var newDecl = postcss.decl( {
                        prop: decl.prop,
                        value: value
                    } );

                    rules[ device.mediaquery ][ selector ].push( newDecl );
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

                var newRule = postcss.rule( {
                    selector: selector
                } );

                selectors[ selector ].forEach( function( decl ) {
                    newRule.append( decl );
                } );

                newAtRule.append( newRule );
            }

            result.root.append( newAtRule );
        }

    };
} );

module.exports = mobileViewportunits;