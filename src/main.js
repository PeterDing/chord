'use strict';

// Here is the main process

const app = require('electron').app;

// https://www.npmjs.com/package/@electron/remote
// Import remote/main at here before using bootstrap
global.remoteMain = require("@electron/remote/main");
global.remoteMain.initialize();

app.on('ready', function() {
    require('./bootstrap-amd').bootstrap('chord/code/electron-main/main');
});
