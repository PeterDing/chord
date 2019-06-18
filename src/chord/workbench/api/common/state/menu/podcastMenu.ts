'use strict';

import { IPodcast } from 'chord/sound/api/podcast';


export interface IPodcastMenuState {
    top: number;
    left: number;

    podcast: IPodcast;
}


export function initiatePodcastMenuState(): IPodcastMenuState {
    return {
        top: 0,
        left: 0,
        podcast: null,
    };
}
