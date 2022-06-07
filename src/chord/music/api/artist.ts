'use strict';

import { IAlbum } from 'chord/music/api/album';
import { ISong } from 'chord/music/api/song';
import { IGenre } from 'chord/music/api/genre';
import { IStyle } from 'chord/music/api/style';
import { ITag } from 'chord/music/api/tag';


export interface IArtist {
    artistId: string | null;

    type?: string;
    origin?: string;
    artistOriginalId?: string;
    // for qq music
    artistMid?: string;
    url?: string;

    artistName?: string;
    artistAlias?: Array<string>;

    // cover url is json for spotify
    artistAvatarUrl?: string | object;
    artistAvatarPath?: string;

    area?: string;

    genres?: Array<IGenre>;
    styles?: Array<IStyle>;
    tags?: Array<ITag>;

    description?: string;

    songs?: Array<ISong>;
    albums?: Array<IAlbum>;

    playCount?: number;

    // how many people collect this artist
    likeCount?: number;

    // If user collect the item, `like` is true
    like?: boolean;
}
