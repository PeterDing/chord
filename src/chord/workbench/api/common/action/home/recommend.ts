'use strict';

import { ISong } from 'chord/music/api/song';
import { ICollection } from 'chord/music/api/collection';

import { Act } from 'chord/workbench/api/common/action/proto';


// For home view
export interface IShowRecommendViewAct extends Act {
    // 'c:mainView:home:showRecommendView'
    type: string;
    act: string;
    songs: Array<ISong>;
    collections: Array<ICollection>;
}

