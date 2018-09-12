'use strict';

const app = require('electron').app;

console.log('=== main process ===');


app.on('ready', function() {
    require('./bootstrap-amd').bootstrap('chord/code/electron-main/main');
});
