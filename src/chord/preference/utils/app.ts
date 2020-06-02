'use strict';

import * as fs from 'fs';

import { APP_SEARCH_HISTORY_PATH } from 'chord/preference/common/app';

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

/**
 * Write keywords to local file
 */
export function writeLocalSearchHistory(...keywords: string[]): void {
    let searchHistoryState = readLocalSearchHistoryState();

    let kwSet = {};
    for (let k of keywords) { kwSet[k] = true; }

    let kws = [...keywords];
    for (let k of searchHistoryState.keywords) {
        // Remove all words which are in kwSet
        if (!kws[k]) {
            kws.push(k);
        }
    }
    searchHistoryState.keywords = kws;

    if (searchHistoryState) fs.writeFileSync(APP_SEARCH_HISTORY_PATH, JSON.stringify(searchHistoryState, null, 4), { encoding: 'utf-8' });
}
