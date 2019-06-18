'use strict';

import { IPodcast } from "chord/sound/api/podcast";


export interface ILibraryPodcast {
    // id for database
    id: number;
    addAt: number;  // millisecond
    podcast: IPodcast;
}
