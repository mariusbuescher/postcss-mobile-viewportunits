# Postcss-mobile-viewportunits

> A plugin that transforms the postcss viewport units

## Installation and setup

```
npm install postcss-mobile-viewportunits
```

### Set up

```javascript
var postcss = require('postcss');

var processor = postcss([
    require('postcss-mobile-viewports')()
]);
```

## Configuration

There is only one option: `devices`. It is an array of devices. By default the devices iPhone 4, iPhone 5, iPhone 5C, iPhone 5S and iPad are given.

Example:

```javascript
var postcss = require('postcss');

var processor = postcss([
    require('postcss-mobile-viewports')({
        devices: [
            // iPad portrait
            {
                mediaquery: 'only screen and (-webkit-min-device-pixel-ratio: 1) and (device-width: 768px) and (device-height: 1024px) and (orientation: portrait)',
                width: 768,
                height: 1024
            },
            // iPad landscape
            {
                mediaquery: 'only screen and (-webkit-min-device-pixel-ratio: 1) and (device-width: 768px) and (device-height: 1024px) and (orientation: landscape)',
                width: 1024,
                height: 768
            }
        ]
    })
]);
```
