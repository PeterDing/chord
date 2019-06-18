'use strict';

import { IEpisode } from "chord/sound/api/episode";


export interface ILibraryEpisode {
    // id for database
    id: number;
    addAt: number;  // millisecond
    episode: IEpisode;
}
