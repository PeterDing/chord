'use strict';

import { IGenre } from 'chord/music/api/genre';
import { IStyle } from 'chord/music/api/style';
import { ITag } from 'chord/music/api/tag';
import { IAudio } from 'chord/music/api/audio';


export interface ISong {
    // songId is the database primary key
    songId: string | null;

    // 'song' or 'artist' or 'album' or 'collection'
    type?: string;

    // where song is from.
    // e.g. xiami or netease
    origin?: string;

    // song id at its origin website
    songOriginalId?: string;

    // song mid for qq
    songMid?: string;
    // song media mid for qq
    songMediaMid?: string;

    // song's url from web
    url?: string;

    // A song's title or name
    songName?: string;

    // A song's sub-title or alias name
    subTitle?: string;

    songWriters?: Array<string>;
    singers?: Array<string>;

    // albumId is the database primary key
    albumId?: string;
    albumOriginalId?: string;
    // album mid for qq
    albumMid?: string;
    albumName?: string;
    albumCoverUrl?: string;
    albumCoverPath?: string;

    // artistId is the database primary key
    artistId?: string;
    artistOriginalId?: string;
    // artist mid for qq
    artistMid?: string;
    artistName?: string;
    artistAvatarUrl?: string;
    artistAvatarPath?: string;

    composer?: string;

    lyricUrl?: string;
    lyricPath?: string;

    track?: number;
    cdSerial?: number;

    genres?: Array<IGenre>;
    styles?: Array<IStyle>;
    tags?: Array<ITag>;

    description?: string;
    duration?: number;

    releaseDate?: number | string;

    audios?: Array<IAudio>;

    // if disable is true, this song is blocked
    disable?: boolean;

    // song playing count from origin
    playCountWeb?: number;

    // song playing count from local user
    playCount?: number;

    likeCount?: number;

    // If user collect the item, `like` is true
    like?: boolean;
}
