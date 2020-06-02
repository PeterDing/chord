'use strict';

import * as debug from 'debug';
const logger = debug('chord:electron-browser');

import { ipcRenderer } from 'electron';


// Handle quit signal
export function handleQuit(): void {
    ipcRenderer.on('chord-quit', () => {
        logger('[event]: chord-quit')
    });
}
