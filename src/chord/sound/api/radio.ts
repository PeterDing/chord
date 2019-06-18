'use strict';

import { IEpisode } from 'chord/sound/api/episode';
import { IPodcast } from 'chord/sound/api/podcast';


/**
 * A radio is one user or one institution who creates podcasts or episodes
 */
export interface IRadio {
    radioId: string;

    // 'radio'
    type: string;

    origin: string;

    radioOriginalId?: string;

    // for qq music
    radioMid?: string;

    url?: string;

    radioName?: string;


    radioCoverUrl?: string;
    radioCoverPath?: string;

    followerCount?: number;
    followingCount?: number;

    // people who follows the radio
    followers?: Array<IRadio>;
    // people who is followed by the radio
    followings?: Array<IRadio>;

    listenCount?: number;

    // created episode count
    episodeCount?: number;
    // created podcast count
    podcastCount?: number;

    favoritePodcastCount?: number;

    episodes?: Array<IEpisode>;
    podcasts?: Array<IPodcast>;

    favoritePodcasts?: Array<IPodcast>;

    description?: string;

    like?: boolean;
}


export interface IAccount {
    radio: IRadio;

    // 'account'
    type: string;

    accessToken?: string;
    refreshToken?: string;

    cookies?: { [key: string]: string };
}
