'use strict';

import { Store } from 'redux';

import { ORIGIN } from 'chord/music/common/origin';

import { makeOffsets, setCurrectOffset } from 'chord/workbench/api/utils/offset';

import { IOffset, initiateOffset } from 'chord/workbench/api/common/state/offset';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { IShowAlbumListOptionsViewAct, IShowAlbumListViewAct, IGetMoreAlbumsAct } from 'src/chord/workbench/api/common/action/home/albums';

import { musicApi } from 'chord/music/core/api';


export async function handleShowAlbumListOptionsView(): Promise<IShowAlbumListOptionsViewAct> {
    let store: Store = (<any>window).store;
    let state: IStateGlobal = store.getState();
    if (!!state.mainView.homeView.albumsView.optionsSet.xiami) {
        return {
            type: 'c:mainView:home:showAlbumListOptionsView',
            act: 'c:mainView:home:showAlbumListOptionsView',

            optionsSet: null,
        };
    }

    let [xiamiOptions, qqOptions] = await Promise.all([
        musicApi.albumListOptions(ORIGIN.xiami),
        musicApi.albumListOptions(ORIGIN.qq),
    ]);

    return {
        type: 'c:mainView:home:showAlbumListOptionsView',
        act: 'c:mainView:home:showAlbumListOptionsView',

        optionsSet: {
            [ORIGIN.xiami]: xiamiOptions,
            [ORIGIN.qq]: qqOptions,
        },
    };
}


export async function handleShowAlbumListView(
    origin: string,
    order: string,
    area: string,
    genre: string,
    type: string,
    year: string,
    company: string,
    size: number = 50): Promise<IShowAlbumListViewAct> {
    let offset = initiateOffset();
    offset.limit = size;

    let albums = await musicApi.albumList(
        origin, order, area, genre, type, year, company, offset.offset, offset.limit);

    offset = setCurrectOffset(origin, offset, albums.length);
    if (albums.length == 0) {
        offset.more = false;
    }

    return {
        type: 'c:mainView:home:showAlbumListView',
        act: 'c:mainView:home:showAlbumListView',

        origin,

        albums,
        albumsOffset: offset,
    };
}


export async function handleGetMoreAlbums(
    origin: string,
    order: string,
    area: string,
    genre: string,
    type: string,
    year: string,
    company: string,
    offset: IOffset,
    size: number
): Promise<IGetMoreAlbumsAct> {
    let albums = [];
    if (offset.more) {
        let offsets = makeOffsets(origin, offset, size);
        let futs = offsets.map(_offset => musicApi.albumList(
            origin, order, area, genre, type, year, company, _offset.offset, _offset.limit));
        let albumsList = await Promise.all(futs);
        albums = albums.concat(...albumsList).slice(0, size);
        offset = setCurrectOffset(origin, offset, albums.length);
    }

    if (albums.length == 0) {
        offset.more = false;
    }

    return {
        type: 'c:mainView:home:albums:getMoreAlbums',
        act: 'c:mainView:home:albums:getMoreAlbums',

        albums,
        albumsOffset: offset,
    };
}
