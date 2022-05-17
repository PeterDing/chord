'use strict';

import * as React from 'react';
import { shell } from 'electron';

const remote = global.electronRemote;


export default class WindowsControlBar extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    min() {
        let win = remote.getCurrentWindow();
        win.minimize();
    }

    max() {
        let win = remote.getCurrentWindow();
        win.maximize();
    }

    close() {
        let win = remote.getCurrentWindow();
        win.close();
    }

    toggleDevTools() {
        let win = remote.getCurrentWindow();
        win.webContents.toggleDevTools();
    }

    report() {
        shell.openExternal('https://github.com/PeterDing/chord/issues');
    }

    render() {
        return (
            <div className='window-controls'>
                <div className='window-controls-container'>

                    <div className='window-icon-bg window-close-bg' onClick={this.close}>
                        <div className='window-icon window-close cursor-pointer'></div>
                    </div>

                    <div className='window-icon-bg' onClick={this.min}>
                        <div className='window-icon window-minimize cursor-pointer'></div>
                    </div>

                    <div className='window-icon-bg' onClick={this.max}>
                        <div className='window-icon window-max-restore window-maximize cursor-pointer'></div>
                    </div>

                    <div className='window-icon-bg' title='Toggle DevTools' onClick={this.toggleDevTools}>
                        <div className='window-icon dev-tools cursor-pointer'></div>
                    </div>

                    <div className='window-icon-bg' title='report' onClick={this.report}>
                        <div className='window-icon report cursor-pointer'></div>
                    </div>

                </div>
            </div>
        );
    }
}
