'use strict';

import { ORIGIN } from 'chord/music/common/origin';


export const DEFAULT_ORDER = {
    [ORIGIN.ximalaya]: {
        episodes: '2',
        podcasts: '2',
        favoritePodcasts: '1',
        followings: '',
    }
};

export const ORDERS = {
    [ORIGIN.ximalaya]: {
        episodes: [
            { id: '1', name: '正序' },
            { id: '2', name: '倒序' },
        ],
        podcasts: [
            { id: '1', name: '正序' },
            { id: '2', name: '倒序' },
        ],
        favoritePodcasts: [
            { id: '1', name: '综合排序' },
            { id: '2', name: '最近更新' },
            { id: '3', name: '最近订阅' },
        ],
    }
};

export const OFFSETS = {
    [ORIGIN.ximalaya]: {
        offset: 0,
        limit: 30,
    }
};

