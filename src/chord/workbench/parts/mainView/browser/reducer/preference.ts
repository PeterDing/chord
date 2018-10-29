'use strict';

import { equal } from 'chord/base/common/assert';

import { IPreferenceViewAct } from 'chord/workbench/api/common/action/mainView';

import { IMainViewState } from 'chord/workbench/api/common/state/mainView/mainView';


export function showPreference(state: IMainViewState, act: IPreferenceViewAct): IMainViewState {
    equal(act.act, 'c:mainView:preferenceView');

    return { ...state, view: 'preferenceView' };
}
