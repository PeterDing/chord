'use strict';

import { Logger } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';
const logger = new Logger(filenameToNodeName(__filename));

import { getDescendentProp, setDescendentProp } from 'chord/base/common/property';
import { Act } from 'chord/workbench/api/common/action/proto';
import { map } from 'chord/workbench/parts/reduceMap';
import { IStateGlobal, initiateStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';


export function mainReducer(state: IStateGlobal, act: Act): IStateGlobal {
    logger.info('[main reducer]: act:', act);

    // Redux initiation
    if (act.type.startsWith('@@redux')) {
        return initiateStateGlobal();
    }

    let { reducer, node } = map(act.act);
    let reducerState = getDescendentProp(state, node);
    logger.info('[main reducer]: node:', node);

    let result = reducer(reducerState, act);
    logger.info('[main reducer]: reducer result:', result);

    let newState = { ...state };
    newState = setDescendentProp(newState, node, result);
    logger.info('[main reducer]: new state:', newState);

    return newState;
}
