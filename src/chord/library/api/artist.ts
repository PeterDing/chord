'use strict';

import { IArtist } from "chord/music/api/artist";


export interface IUserArtist {
    // id for database
    id: number;
    addAt: number;  // millisecond
    artist: IArtist;
}
