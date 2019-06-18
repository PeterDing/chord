'use strict';

import { equal } from 'chord/base/common/assert';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { IAddToQueueAct } from 'chord/workbench/api/common/action/player';


export function addToQueue(state: IPlayerState, act: IAddToQueueAct): IPlayerState {
    equal(act.act, 'c:player:addToQueue');

    let playList;
    let index = state.index;
    switch (act.direction) {
        case 'tail':
            playList = [...state.playList, ...act.playItems];
            break;
        case 'head':
            index = state.index + act.playItems.length;
            playList = [...act.playItems, ...state.playList];
            break;
    }
    return { ...state, playList, index, id: Date.now() };
}
