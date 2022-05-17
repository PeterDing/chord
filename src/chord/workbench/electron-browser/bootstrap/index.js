'use strict';

// Here is renderer process

const path = require('path');
const fs = require('fs');
const ps = require('process');

// Import the remote in renderer process
global.electronRemote = require('@electron/remote');
global.reactDOMClient = require('react-dom/client');

// path: chord/loader.js
const loaderFilename = path.join(__dirname + '../../../../loader.js');

// path: chord/loader.js
var loader = require('../../../loader');

function uriFromPath(_path) {
    var pathName = path.resolve(_path).replace(/\\/g, '/');

    if (pathName.length > 0 && pathName.charAt(0) !== '/') {
        pathName = '/' + pathName;
    }

    return encodeURI('file://' + pathName);
}

window.nodeRequire = require.__$__nodeRequire;

let config = {
    baseUrl: uriFromPath(path.join(__dirname, '../../../../')),
    catchError: true,
    nodeRequire: require,
};
loader.require.config(config);

let bootstrap = function (entrypoint, onLoad, onError) {
    if (!entrypoint) {
        return;
    }

    onLoad = onLoad || function () {};
    onError = onError || function (err) {
        console.error(err);
    };

    loader.require([entrypoint], onLoad, onError);
};

// load css-loader
bootstrap('chord/css');
bootstrap('chord/workbench/electron-browser/main');
// bootstrap('chord/vvv');

let isMacintosh = (ps.platform === 'darwin');
if (!isMacintosh) {
    bootstrap('chord/workbench/electron-browser/scrollbar');
}
