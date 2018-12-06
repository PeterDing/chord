'use strict';

import { Act } from 'chord/workbench/api/common/action/proto';


export interface INavigationSearchAct extends Act {
    // 'c:mainView:searchView'
    type: string;
    act: string;
}


export interface INavigationComebackAct extends Act {
    // 'c:mainView:comeback'
    type: string;
    act: string;
    view: string;
}


export interface INavigationPreferenceAct extends Act {
    // 'c:mainView:preferenceView'
    type: string;
    act: string;
}
