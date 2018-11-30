'use strict';

import * as fs from 'fs';

import { APP_SEARCH_HISTORY_PATH } from 'chord/preference/common/app';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { ISearchHistoryState, initiateSearchHistoryState } from 'chord/workbench/api/common/state/mainView/searchView';


export function readLocalSearchHistoryState(): ISearchHistoryState {
    let state: ISearchHistoryState;
    try {
        state = JSON.parse(fs.readFileSync(APP_SEARCH_HISTORY_PATH).toString());
    } catch (e) {
        state = initiateSearchHistoryState();
    }
    return state;
}

export function writeLocalSearchHistoryState(): void {
    let state: IStateGlobal = (<any>window).store.getState();
    let searchHistoryState = state.mainView.searchView.history;
    if (searchHistoryState) fs.writeFileSync(APP_SEARCH_HISTORY_PATH, JSON.stringify(searchHistoryState, null, 4), { encoding: 'utf-8' });
}
