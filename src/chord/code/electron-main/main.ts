'use strict';

import * as path from "path";

import { app, BrowserWindow, Menu } from 'electron';
import { menuTemplate } from 'chord/code/electron-main/menu/template';


console.log('=== main electron behave main===');


let win: BrowserWindow;

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});


function createWindow() {
    console.log('=== Create a Window ===');

    win = new BrowserWindow({
        height: 800,
        width: 1150,
    });


    // path: chord/workbench/electron-browser/bootstrap/index.html
    win.loadFile(path.join(__dirname, '../../workbench/electron-browser/bootstrap/index.html'));
    // win.webContents.openDevTools();

    win.on('close', () => {
        win = null;
    });

    // set menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}

createWindow();
