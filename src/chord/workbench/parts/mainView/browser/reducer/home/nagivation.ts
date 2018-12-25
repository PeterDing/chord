'use strict';

import { equal } from 'chord/base/common/assert';

import { IHomeViewState } from 'chord/workbench/api/common/state/mainView/home/homeView';
import { IChangeHomeViewAct } from 'chord/workbench/api/common/action/home/nagivation';


export function changeHomeView(state: IHomeViewState, act: IChangeHomeViewAct): IHomeViewState {
    equal(act.act, 'c:mainView:home:navigation:changeView');
    return { ...state, view: act.view };
}
