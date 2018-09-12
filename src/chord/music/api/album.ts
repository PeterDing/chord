'use strict';

import { ISong } from 'chord/music/api/song';
import { IGenre } from 'chord/music/api/genre';
import { IStyle } from 'chord/music/api/style';
import { ITag } from 'chord/music/api/tag';


export interface IAlbum {
    albumId: string | null;

    origin?: string;
    albumOriginalId?: string;
    url?: string;

    albumName?: string;
    albumCoverUrl?: string;
    albumCoverPath?: string;

    artistId?: string;
    artistOriginalId?: string;
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
}
