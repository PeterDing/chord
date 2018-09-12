var path = require('path');
var glob = require('glob');
var process = require('process');

var select = process.env.select;

var TEST_GLOB = '**/test/**/*.test.js';
var out = 'out';

var loader = require('../' + 'out' + '/chord/loader');
var src = path.join(path.dirname(__dirname), out);


const loadConfig = {
    baseUrl: path.join(path.dirname(__dirname), 'out'),
    catchError: true,
    nodeRequire: require,
    nodeMain: __filename,
}
loader.config(loadConfig);

global.define = loader;


/**
 * WARNING, No test files can be empty
 */
const loadFunc = cb => {
    const doRun = tests => {
        const modulesToLoad = tests
            .filter(test => new RegExp(select || '').test(test))
            .map(test => {
                if (path.isAbsolute(test)) {
                    test = path.relative(src, path.resolve(test));
                }

                return test.replace(/(\.js)|(\.d\.ts)|(\.js\.map)$/, '');
        });
        console.log(modulesToLoad);
        define(modulesToLoad, () => { cb(null); }, cb);
    };

    glob(TEST_GLOB, { cwd: src }, function(err, files) { doRun(files); });
}


loadFunc(err => {
    if (err) {
        console.log('[test/all]: Error:');
        console.log(err);
    } else {
        console.log('!!! Test runing !!!');
        run();
    }
});


/**
 * Sync
 *
 */
// const modulesToLoad = glob.GlobSync(TEST_GLOB, { cwd: src }).found.map(test => {
//     if (path.isAbsolute(test)) {
//         test = path.relative(src, path.resolve(test));
//     }
// 
//     return test.replace(/(\.js)|(\.d\.ts)|(\.js\.map)$/, '');
// });
// 
// console.log(modulesToLoad);
// 
// loader(modulesToLoad, () => {
//     console.log('Test runing !!!');
//     run();
// }, (e) => {
//     console.log('[test/all]: Error:');
//     console.log(err);
// });
