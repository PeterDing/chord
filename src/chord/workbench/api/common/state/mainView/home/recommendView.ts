'use strict';

import { ISong } from 'chord/music/api/song';
import { ICollection } from 'chord/music/api/collection';


export interface IRecommendViewState {
    songs: Array<ISong>;
    collections: Array<ICollection>;
}


export function initiateRecommendViewState():  IRecommendViewState{
    return {
        songs: [],
        collections: [],
    };
}

