'use strict';

import { ISong } from 'chord/music/api/song';
import { ITag } from 'chord/music/api/tag';


export interface ICollection {
    collectionId: string;

    origin?: string;
    collectionOriginalId?: string;
    url?: string;

    collectionName?: string;

    collectionCoverUrl?: string;
    collectionCoverPath?: string;

    userId?: string;
    userName?: string;

    releaseDate?: number;

    description?: string;

    tags?: Array<ITag>;

    duration?: number;

    songs?: Array<ISong>;
    songCount?: number;
}
