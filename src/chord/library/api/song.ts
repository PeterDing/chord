'use strict';

import { ISong } from "chord/music/api/song";


export interface IUserSong {
    // id for database
    id: number;
    addAt: number;  // millisecond
    song: ISong;
}
