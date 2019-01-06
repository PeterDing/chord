'use strict';

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { ICollection } from 'chord/music/api/collection';

import { musicApi } from 'chord/music/core/api';


async function getMoreItems<T>(func: (origin, offset, limit) => Promise<Array<T>>, offset: number, limit: number): Promise<Array<T>> {
    let itemLists = await Promise.all([
        func.bind(musicApi)('xiami', offset, limit),
        func.bind(musicApi)('netease', offset, limit),
        func.bind(musicApi)('qq', offset, limit),
    ]);
    let items = [];
    for (let i of Array(limit).keys()) {
        for (let j of Array(3).keys()) {
            let item = itemLists[j][i];
            if (item) items.push(item);
        }
    }
    return items;
}


export async function getMoreSongs(offset: number, limit: number): Promise<Array<ISong>> {
    return getMoreItems(musicApi.newSongs, offset, limit);
}

export async function getMoreAlbums(offset: number, limit: number): Promise<Array<IAlbum>> {
    return getMoreItems(musicApi.newAlbums, offset, limit);
}

export async function getMoreCollections(offset: number, limit: number): Promise<Array<ICollection>> {
    return getMoreItems(musicApi.newCollections, offset, limit);
}
