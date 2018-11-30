'use strict';

import { ipcRenderer } from 'electron';

import { writeLocalSearchHistoryState } from 'chord/preference/utils/app';


// Handle quit signal
export function handleQuit(): void {
    ipcRenderer.on('chord-quit', () => {
        writeLocalSearchHistoryState();
    });
}
