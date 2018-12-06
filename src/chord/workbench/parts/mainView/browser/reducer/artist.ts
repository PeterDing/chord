'use strict';

import { equal } from 'chord/base/common/assert';

import { IGetMoreArtistSongsAct, IGetMoreArtistAlbumsAct } from 'chord/workbench/api/common/action/mainView';

import { IArtistViewState } from 'chord/workbench/api/common/state/mainView/artistView';


export function getMoreArtistSongs(state: IArtistViewState, act: IGetMoreArtistSongsAct): IArtistViewState {
    equal(act.act, 'c:mainView:getMoreArtistSongs');

    let songs = [...state.artist.songs, ...act.songs];
    let artist = { ...state.artist, songs };
    let songsOffset = act.songsOffset;
    return { ...state, artist, songsOffset };
}


export function getMoreArtistAlbums(state: IArtistViewState, act: IGetMoreArtistAlbumsAct): IArtistViewState {
    equal(act.act, 'c:mainView:getMoreArtistAlbums');

    let albums = [...state.artist.albums, ...act.albums];
    let artist = { ...state.artist, albums };
    let albumsOffset = act.albumsOffset;
    return { ...state, artist, albumsOffset };
}
