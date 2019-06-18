'use strict';

import { IEpisode } from 'chord/sound/api/episode';


export interface IEpisodeMenuState {
    top: number;
    left: number;

    episode: IEpisode;
}


export function initiateEpisodeMenuState(): IEpisodeMenuState {
    return {
        top: 0,
        left: 0,
        episode: null,
    };
}
