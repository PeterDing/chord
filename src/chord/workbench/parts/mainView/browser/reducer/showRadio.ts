'use strict';

import { equal } from 'chord/base/common/assert';

import { IShowRadioAct } from 'chord/workbench/api/common/action/mainView';

import { IRadioViewState } from 'chord/workbench/api/common/state/mainView/radioView';


export function showRadioView(state: IRadioViewState, act: IShowRadioAct): IRadioViewState {
    equal(act.act, 'c:mainView:showRadioView');

    return { ...state, radio: act.radio };
}
