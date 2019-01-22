'use strict';

import { Logger } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';
const logger = new Logger(filenameToNodeName(__filename));

import 'chord/css!./media/main';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { mainReducer } from 'chord/workbench/parts/reducer';

import { CAudio } from 'chord/workbench/api/node/audio';

import RootView from 'chord/workbench/electron-browser/rootView';

import { handleQuit } from 'chord/workbench/electron-browser/action/quit';

import { webFrame } from 'electron';


logger.info('electron rendering process activate')


// Disable zoom
// https://github.com/electron/electron/issues/3609#issuecomment-289537969
webFrame.setVisualZoomLevelLimits(1, 1);


const store = createStore(mainReducer);

// Set global store
(window as any).store = store;


function App() {
    return (
        <Provider store={store}>
            <RootView />
        </Provider>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));


// configure CAudio
CAudio.registerStore(store);


handleQuit();
