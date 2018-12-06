'use strict';

import { app, shell } from 'electron';


export const menuTemplate = (win) => [
    {
        label: "Application",
        submenu: [
            {
                label: 'About Chord',
                click() { shell.openExternal('https://github.com/PeterDing/chord') }
            },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); } },
        ]
    },
    {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
    },
    {
        label: "View",
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
