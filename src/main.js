'use strict';

const app = require('electron').app;

app.on('ready', function() {
    require('./bootstrap-amd').bootstrap('chord/code/electron-main/main');
});
