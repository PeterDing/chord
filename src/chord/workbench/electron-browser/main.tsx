'use strict';

console.log('=== electron rendering process ===');

import 'chord/css!./media/main';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { mainReducer } from 'chord/workbench/parts/reducer';

import { CAudio } from 'chord/workbench/api/node/audio';
import { onPlay, onPause, onEnd } from 'chord/workbench/parts/player/browser/component/processBar';

import RootView from 'chord/workbench/electron-browser/rootView';


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
CAudio.registerOnPlay(onPlay);
CAudio.registerOnPause(onPause);
CAudio.registerOnEnd(onEnd);
