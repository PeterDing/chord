'use strict';

import * as React from 'react';

import { ISeekAct } from 'chord/workbench/api/common/action/player';


export function handleSeek(e: React.MouseEvent<HTMLDivElement>, box: HTMLDivElement): ISeekAct {
    let percent: number = e.clientX / box.offsetWidth;
    console.log('[handleSeek]: percent: ' + percent);
    return {
        type: 'c:player:seek',
        act: 'c:player:seek',
        percent,
    }
}
