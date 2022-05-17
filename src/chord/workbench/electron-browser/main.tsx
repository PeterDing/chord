'use strict';

// Here is renderer process

import { Logger } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';
const logger = new Logger(filenameToNodeName(__filename));

import 'chord/css!./media/main';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, Store } from 'redux';

import { mainReducer } from 'chord/workbench/parts/reducer';

import { CAudio } from 'chord/workbench/api/node/audio';

import RootView from 'chord/workbench/electron-browser/rootView';

import { handleQuit } from 'chord/workbench/electron-browser/action/quit';

import { webFrame } from 'electron';

import 'chord/workbench/events/player';

logger.info('electron rendering process activate')

const reactDOMClient = global.reactDOMClient;

// Disable zoom
// https://github.com/electron/electron/issues/3609#issuecomment-289537969
webFrame.setVisualZoomLevelLimits(1, 1);


const store = createStore(mainReducer) as Store;

// Set global store
(window as any).store = store;


function App() {
    return (
        <Provider store={store}>
            <RootView />
        </Provider>
    );
}

// ReactDOM.render(<App />, document.getElementById('root'));
const container = document.getElementById('root');
const root = reactDOMClient.createRoot(container);
root.render(<App />);

// configure CAudio
CAudio.registerStore(store);


handleQuit();
