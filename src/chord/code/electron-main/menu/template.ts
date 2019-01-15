'use strict';

import { app, shell, MenuItemConstructorOptions } from 'electron';


export const menuTemplate = (win): MenuItemConstructorOptions[] => [
    {
        label: 'Application',
        submenu: [
            {
                label: 'About Chord',
                click() { shell.openExternal('https://github.com/PeterDing/chord') }
            },
            { type: 'separator' },
            { label: 'Quit', accelerator: 'Command+Q', click: function() { app.quit(); } },
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
            { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
            { type: 'separator' },
            { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
            { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
            { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
            { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: 'Alt+Command+I',
                click() {
                    win.show();
                    win.toggleDevTools();
                }
            },
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Fork at Github',
                click() { shell.openExternal('https://github.com/PeterDing/chord') }
            },
            {
                label: 'Report Bug',
                click() { shell.openExternal('https://github.com/PeterDing/chord/issues') }
            },
        ]
    },
];
