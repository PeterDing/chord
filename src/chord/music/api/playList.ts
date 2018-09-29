'use strict';

import { ISong } from 'chord/music/api/song';


export interface IPlayList {
    playListId: string;

    playListName?: string;

    songs?: Array<ISong>;
    songCount?: number;
}
