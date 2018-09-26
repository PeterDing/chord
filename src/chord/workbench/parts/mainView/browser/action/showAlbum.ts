'use strict';

import { IShowAlbumAct } from 'chord/workbench/api/common/action/mainView';

import { IAlbum } from 'chord/music/api/album';

import { musicApi } from 'chord/music/core/api';


export async function handleShowAlbumView(album: IAlbum): Promise<IShowAlbumAct> {
    if (!album.songs || !album.songs.length) {
        album = await musicApi.album(album.albumId);
    }
    return {
        type: 'c:mainView:showAlbumView',
        act: 'c:mainView:showAlbumView',
        album,
    };
}


export async function handleShowAlbumViewById(albumId: string): Promise<IShowAlbumAct> {
    let album = await musicApi.album(albumId);
    return handleShowAlbumView(album);
}
