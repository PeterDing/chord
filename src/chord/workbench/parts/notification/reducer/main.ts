'use strict';

import { getDescendentProp, setDescendentProp } from 'chord/base/common/property';
import { Act } from 'chord/workbench/api/common/action/proto';
import { map } from 'chord/workbench/parts/notification/reducer/reduceMap';
import { INotificationState } from 'chord/workbench/api/common/state/notification';


export function notificationReducer(state: INotificationState, act: Act): INotificationState {
    let { reducer, node } = map(act.act);
    let reducerState = getDescendentProp(state, node);
    let result = reducer(reducerState, act);
    let newState = { ...state };
    newState = setDescendentProp(newState, node, result);
    return newState;
}

