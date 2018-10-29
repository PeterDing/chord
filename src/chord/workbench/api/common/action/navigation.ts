'use strict';

import { Act } from 'chord/workbench/api/common/action/proto';


export interface INavigationSearchAct extends Act {
    // 'c:mainview:searchView'
    type: string;
    act: string;
}


export interface INavigationComebackAct extends Act {
    // 'c:mainview:comeback'
    type: string;
    act: string;
    view: string;
}


export interface INavigationPreferenceAct extends Act {
    // 'c:mainview:preferenceView'
    type: string;
    act: string;
}
