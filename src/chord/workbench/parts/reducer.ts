'use strict';

import { getDescendentProp, setDescendentProp } from 'chord/base/common/property';
import { Act } from 'chord/workbench/api/common/action/proto';
import { map } from 'chord/workbench/parts/reduceMap';
import { IStateGlobal, initiateStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';


export function mainReducer(state: IStateGlobal, act: Act): IStateGlobal {
    console.log('[mainReducer]: act: ', act);
    console.log('[mainReducer]: global state: ', state);

    // Redux initiation
    if (act.type.startsWith('@@redux')) {
        return initiateStateGlobal();
    }

    let { reducer, node } = map(act.act);
    let reducerState = getDescendentProp(state, node);

    console.log('+++ ori state: node: ' + node);
    console.log('+++ reducer state:', reducerState);
    console.log('+++ reducer:', reducer);

    let result = reducer(reducerState, act);
    console.log('+++ main reducer result:', result);
    console.log('+++ main reducer act:', act);
    let newState = { ...state };
    newState = setDescendentProp(newState, node, result);

    console.log('+++ main reducer new state:', newState);
    return newState;
}
