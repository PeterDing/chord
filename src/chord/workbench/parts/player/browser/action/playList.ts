'use strict';

import { IPlayAct } from 'chord/workbench/api/common/action/player';


export function handlePlay(index: number): IPlayAct {
    return {
        type: 'c:player:play',
        act: 'c:player:play',
        index,
    };
}
