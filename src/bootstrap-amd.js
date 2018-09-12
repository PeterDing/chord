var path = require('path');
var loader = require('./chord/loader');

function uriFromPath(_path) {
    var pathName = path.resolve(_path).replace(/\\/g, '/');

    if (pathName.length > 0 && pathName.charAt(0) !== '/') {
        pathName = '/' + pathName;
    }

    return encodeURI('file://' + pathName);
}

const config = {
    baseUrl: uriFromPath(__dirname),
    catchError: true,
    nodeRequire: require,
    nodeMain: __filename,
    // 'vs/nls': nlsConfig,
    // nodeCachedDataDir: process.env['VSCODE_NODE_CACHED_DATA_DIR_' + process.pid]
}
loader.config(config);

exports.bootstrap = function(entrypoint, onLoad, onError) {
    if (!entrypoint) {
        return;
    }

    onLoad = onLoad || function() {};
    onError = onError || function(err) {
        console.error(err);
    };

    loader([entrypoint], onLoad, onError);
};
