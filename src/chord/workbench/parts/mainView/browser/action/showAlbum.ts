'use strict';

import { IShowAlbumAct } from 'chord/workbench/api/common/action/mainView';

import { IAlbum } from 'chord/music/api/album';

import { aliMusicApi } from 'chord/music/xiami/api';


export async function handleShowAlbumView(album: IAlbum): Promise<IShowAlbumAct> {
    if (!album.songs || !album.songs.length) {
        // TODO, Check album origin to pick correct api
        album = await aliMusicApi.album(album.albumOriginalId);
    }
    return {
        type: 'c:mainView:showAlbumView',
        act: 'c:mainView:showAlbumView',
        album,
    };
}


export async function handleShowAlbumViewById(albumId: string): Promise<IShowAlbumAct> {
    let album = await aliMusicApi.album(albumId.split('|')[2]);
    return handleShowAlbumView(album);
}
