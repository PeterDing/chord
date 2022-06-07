'use strict';

import { IGenre } from 'chord/music/api/genre';
import { IStyle } from 'chord/music/api/style';
import { ITag } from 'chord/music/api/tag';
import { IAudio } from 'chord/music/api/audio';


export interface IEpisode {
    // episodeId is the database primary key
    episodeId: string | null;

    // 'episode' or 'podcast' or 'radio'
    type?: string;

    // where episode is from.
    // e.g. xiami or netease
    origin?: string;

    // episode id at its origin website
    episodeOriginalId?: string;

    // episode mid for qq
    episodeMid?: string;
    // episode media mid for qq
    episodeMediaMid?: string;

    // episode's url from web
    url?: string;

    // A episode's title or name
    episodeName?: string;

    // A episode's sub-title or alias name
    subTitle?: string;

    people?: Array<string>;

    // podcastId is the database primary key
    podcastId?: string;
    podcastOriginalId?: string;
    // podcast mid for qq
    podcastMid?: string;
    podcastName?: string;
    podcastCoverUrl?: string;
    podcastCoverPath?: string;

    // radioId is the database primary key
    radioId?: string;
    radioOriginalId?: string;
    // radio mid for qq
    radioMid?: string;
    radioName?: string;
    radioCoverUrl?: string;
    radioCoverPath?: string;

    composer?: string;

    lyricUrl?: string;
    lyricPath?: string;

    track?: number;

    genres?: Array<IGenre>;
    styles?: Array<IStyle>;
    tags?: Array<ITag>;

    description?: string;

    // millisecond
    duration?: number;

    releaseDate?: number | string;

    audios?: Array<IAudio>;

    // if disable is true, this episode is blocked
    disable?: boolean;

    // episode playing count from origin
    playCountWeb?: number;

    // episode playing count from local user
    playCount?: number;

    likeCount?: number;

    // If user collect the item, `like` is true
    like?: boolean;
}
