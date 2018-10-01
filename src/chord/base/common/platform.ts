'use strict';


let _isWindows = false;
let _isMacintosh = false;
let _isLinux = false;


// OS detection
if (typeof process === 'object' && typeof process.nextTick === 'function' && typeof process.platform === 'string') {
    _isWindows = (process.platform === 'win32');
    _isMacintosh = (process.platform === 'darwin');
    _isLinux = (process.platform === 'linux');
} else if (typeof navigator === 'object') {
    const userAgent = navigator.userAgent;
    _isWindows = userAgent.indexOf('Windows') >= 0;
    _isMacintosh = userAgent.indexOf('Macintosh') >= 0;
    _isLinux = userAgent.indexOf('Linux') >= 0;
}


export const isWindows = _isWindows;
export const isMacintosh = _isMacintosh;
export const isLinux = _isLinux;
