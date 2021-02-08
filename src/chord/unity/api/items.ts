'use strict';

import { ISong } from 'chord/music/api/song';
import { ORIGIN } from 'chord/music/common/origin';
import { IEpisode } from 'chord/sound/api/episode';


export type TPlayItem = ISong | IEpisode;

export enum UnavailableOrigins {
    // xiami has shutdown its server.
    xiami = ORIGIN.xiami,
}

export function isOriginAlive(origin: ORIGIN): boolean {
    if (UnavailableOrigins[origin]) {
        return false;
    } else {
        return true;
    }
}
