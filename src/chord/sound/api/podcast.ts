'use strict';

import { IEpisode } from 'chord/sound/api/episode';
import { IGenre } from 'chord/music/api/genre';
import { IStyle } from 'chord/music/api/style';
import { ITag } from 'chord/music/api/tag';


export interface IPodcast {
    podcastId: string | null;

    type?: string;
    origin?: string;
    podcastOriginalId?: string;
    // for qq music
    podcastMid?: string;
    url?: string;

    podcastName?: string;
    podcastCoverUrl?: string;
    podcastCoverPath?: string;

    radioId?: string;
    radioOriginalId?: string;

    radioMid?: string;
    radioName?: string;

    subTitle?: string;
    description?: string;

    genres?: Array<IGenre>;
    styles?: Array<IStyle>;
    tags?: Array<ITag>;

    duration?: number;

    releaseDate?: number;

    company?: string;

    episodes?: Array<IEpisode>;
    episodeCount?: number;

    playCount?: number;

    likeCount?: number;

    // If user collect the item, `like` is true
    like?: boolean;
}
