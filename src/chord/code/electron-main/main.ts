'use strict';

import { Logger } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';
const logger = new Logger(filenameToNodeName(__filename));

import * as process from 'process';
import * as path from 'path';

import { app, BrowserWindow, Menu } from 'electron';
import { menuTemplate } from 'chord/code/electron-main/menu/template';

import { isWindows, isMacintosh } from 'chord/base/common/platform';


logger.info('electron main active');


const DEV = process.env.ELECTRON_DEV ? true : false;

logger.info(`[env]: ELECTRON_DEV : ${DEV}`);


let win: BrowserWindow;

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    logger.info('[event]: window-all-closed');

    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (!isMacintosh) {
        app.quit();
    }
});

app.on('before-quit', (event) => {
    logger.info('[event]: before-quit');
});

app.on('activate', () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        logger.info('[event]: create window');
        createWindow();
    }
});


function createWindow() {
    win = new BrowserWindow({
        height: 800,
        width: 1150,

        // For mac, linux, frameless
        titleBarStyle: 'hiddenInset',

        // For windows, frameless
        frame: isWindows ? false : true,

        webPreferences: { nodeIntegration: true },
    });


    // path: chord/workbench/electron-browser/bootstrap/index.html
    win.loadFile(path.join(__dirname, '../../workbench/electron-browser/bootstrap/index.html'));

    if (DEV) {
        win.webContents.openDevTools();
    }

    win.on('close', () => {
        logger.info('[event]: window close');
        win.webContents.send('chord-quit', null);
        win = null;
    });

    // set menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate(win)));
}

createWindow();
