'use strict';

import { ISong } from "chord/music/api/song";


export interface ILibrarySong {
    // id for database
    id: number;
    addAt: number;  // millisecond
    song: ISong;
}
