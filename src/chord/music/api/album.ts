'use strict';

import { ISong } from 'chord/music/api/song';
import { IGenre } from 'chord/music/api/genre';
import { IStyle } from 'chord/music/api/style';
import { ITag } from 'chord/music/api/tag';


export interface IAlbum {
    albumId: string | null;

    type?: string;
    origin?: string;
    albumOriginalId?: string;
    // for qq music
    albumMid?: string;
    url?: string;

    albumName?: string;
    albumCoverUrl?: string;
    albumCoverPath?: string;

    artistId?: string;
    artistOriginalId?: string;
    // for qq music
    artistMid?: string;
    artistName?: string;

    subTitle?: string;
    description?: string;

    genres?: Array<IGenre>;
    styles?: Array<IStyle>;
    tags?: Array<ITag>;

    duration?: number;

    releaseDate?: number;

    company?: string;

    songs?: Array<ISong>;
    songCount?: number;

    playCount?: number;

    likeCount?: number;

    // If user collect the item, `like` is true
    like?: boolean;
}
