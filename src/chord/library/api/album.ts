'use strict';

import { IAlbum } from "chord/music/api/album";


export interface IUserAlbum {
    // id for database
    id: number;
    addAt: number;  // millisecond
    album: IAlbum;
}
