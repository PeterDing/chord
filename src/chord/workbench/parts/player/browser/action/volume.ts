'use strict';

import * as React from 'react';

import { IVolumeAct } from 'chord/workbench/api/common/action/player'


export function handleVolume(e: React.MouseEvent<HTMLDivElement>, box: HTMLDivElement): IVolumeAct {
    let volume: number = e.nativeEvent.offsetX / box.offsetWidth;

    return {
        type: 'c:player:volume',
        act: 'c:player:volume',
        volume,
    };
}
