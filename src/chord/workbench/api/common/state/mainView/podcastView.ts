'use strict';

import { IPodcast } from 'chord/sound/api/podcast';


export interface IPodcastViewState {
    podcast: IPodcast;
}


export function initiatePodcastViewState(): IPodcastViewState {
    return {
        podcast: null,
    }
}
