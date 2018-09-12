'use strict';

import { ISearchViewAct } from 'chord/workbench/api/common/action/mainView';


export function search(): ISearchViewAct {
    return {
        type: 'c:mainView:searchView',
        act: 'c:mainView:searchView',
    }
}
