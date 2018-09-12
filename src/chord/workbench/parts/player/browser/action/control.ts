'use strict';

import { IRewindAct, IPlayPauseAct, IForwardAct } from 'chord/workbench/api/common/action/player'


export function handleRewind(): IRewindAct {
    return {
        type: 'c:player:rewind',
        act: 'c:player:rewind',
    };
}

export function handlePlayPause(): IPlayPauseAct {
    return {
        type: 'c:player:playPause',
        act: 'c:player:playPause',
    };
}

export function handleForward(): IForwardAct {
    return {
        type: 'c:player:forward',
        act: 'c:player:forward',
    };
}
