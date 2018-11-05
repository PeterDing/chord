'use strict';

import { IAlbum } from "chord/music/api/album";


export interface ILibraryAlbum {
    // id for database
    id: number;
    addAt: number;  // millisecond
    album: IAlbum;
}
