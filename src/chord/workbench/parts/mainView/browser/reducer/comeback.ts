'use strict';

import { equal } from 'chord/base/common/assert';
import { INavigationComebackAct } from 'chord/workbench/api/common/action/navigation';
import { IMainViewState } from 'chord/workbench/api/common/state/mainView/mainView';


export function comebackView(state: IMainViewState, act: INavigationComebackAct): IMainViewState {
    equal(act.act, 'c:mainView:comeback');

    return { ...state, view: act.view };
}
