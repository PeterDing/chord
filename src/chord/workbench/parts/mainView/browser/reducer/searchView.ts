'use strict';

import { equal } from 'chord/base/common/assert';
import { ISearchViewAct } from 'chord/workbench/api/common/action/mainView';
import { ISearchViewState } from 'chord/workbench/api/common/state/mainView/searchView';


export function showSearchView(state: ISearchViewState, act: ISearchViewAct): ISearchViewState {
    equal(act.act, 'c:mainView:searchView');

    return { ...state, view: 'searchHistory' };
}
