'use strict';

import { ISong } from 'chord/music/api/song';


export interface IPlayList {
    playListId: string;

    type?: string;
    playListName?: string;

    songs?: Array<ISong>;
    songCount?: number;

    // If user collect the item, `like` is true
    like?: boolean;
}
