'use strict';

import { IAlbum } from 'chord/music/api/album';
import { ISong } from 'chord/music/api/song';
import { IGenre } from 'chord/music/api/genre';
import { IStyle } from 'chord/music/api/style';
import { ITag } from 'chord/music/api/tag';


export interface IArtist {
    artistId: string | null;

    origin?: string;
    artistOriginalId?: string;
    url?: string;

    artistName?: string;
    artistAlias?: Array<string>;

    artistAvatarUrl?: string;
    artistAvatarPath?: string;

    area?: string;

    genres?: Array<IGenre>;
    styles?: Array<IStyle>;
    tags?: Array<ITag>;

    description?: string;

    songs?: Array<ISong>;
    albums?: Array<IAlbum>;
}
