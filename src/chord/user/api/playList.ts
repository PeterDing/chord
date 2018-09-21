'use strict';

import { IPlayList } from "chord/music/api/playList";


export interface IUserPlayList {
    // id for database
    id: number;
    addAt: number;  // millisecond
    collection: IPlayList;
}

