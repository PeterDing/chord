'use strict';

import { ISong } from 'chord/music/api/song';
import { ITag } from 'chord/music/api/tag';


export interface ICollection {
    collectionId: string;

    type?: string;
    origin?: string;
    collectionOriginalId?: string;
    url?: string;

    collectionName?: string;

    // cover url is json for spotify
    collectionCoverUrl?: string | object;
    collectionCoverPath?: string;

    userId?: string;
    // For qq music
    userMid?: string;
    userName?: string;

    releaseDate?: number;

    description?: string;

    tags?: Array<ITag>;

    duration?: number;

    songs?: Array<ISong>;
    songCount?: number;

    playCount?: number;

    likeCount?: number;

    // If user collect the item, `like` is true
    like?: boolean;
}
