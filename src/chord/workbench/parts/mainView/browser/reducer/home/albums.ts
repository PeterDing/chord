'use strict';

import { equal } from 'chord/base/common/assert';

import { IHomeViewState } from 'chord/workbench/api/common/state/mainView/home/homeView';
import { IAlbumsViewState } from 'chord/workbench/api/common/state/mainView/home/albumsView';

import { IShowAlbumListOptionsViewAct, IShowAlbumListViewAct, IGetMoreAlbumsAct } from 'src/chord/workbench/api/common/action/home/albums';


export function showAlbumListOptions(state: IHomeViewState, act: IShowAlbumListOptionsViewAct): IHomeViewState {
    equal(act.act, 'c:mainView:home:showAlbumListOptionsView');

    let optionsSet = act.optionsSet;
    if (!!optionsSet) {
        return {
            ...state,
            view: 'albumsView',
            albumsView: {
                ...state.albumsView,
                view: 'options',
                optionsSet,

                // clean cache
                albums: [],
                albumsOffset: null,
            }
        };
    } else {
        return {
            ...state,
            view: 'albumsView',
            albumsView: {
                ...state.albumsView,
                view: 'options',

                // clean cache
                albums: [],
                albumsOffset: null,
            }
        };
    }
}


export function showAlbumList(state: IHomeViewState, act: IShowAlbumListViewAct): IHomeViewState {
    equal(act.act, 'c:mainView:home:showAlbumListView');

    let { origin, albums, albumsOffset } = act;
    let albumsViewState = state.albumsView;

    return { ...state, albumsView: { ...albumsViewState, view: 'albums', origin, albums, albumsOffset } };
}


export function getMoreAlbums(state: IAlbumsViewState, act: IGetMoreAlbumsAct): IAlbumsViewState {
    equal(act.act, 'c:mainView:home:albums:getMoreAlbums');

    let { albums, albumsOffset } = act;

    return { ...state, albums: [...state.albums, ...albums], albumsOffset };
}
