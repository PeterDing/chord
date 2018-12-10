'use strict';

import { getDescendentProp, setDescendentProp } from 'chord/base/common/property';
import { Act } from 'chord/workbench/api/common/action/proto';
import { map } from 'chord/workbench/parts/player/browser/reducer/reduceMap';
import { IPlayerState } from 'chord/workbench/api/common/state/player';


export function playerReducer(state: IPlayerState, act: Act): IPlayerState {
    let { reducer, node } = map(act.act);
    let reducerState = getDescendentProp(state, node);
    let result = reducer(reducerState, act);
    let newState = { ...state };
    newState = setDescendentProp(newState, node, result);
    return newState;
}
