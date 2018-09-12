'use strict';

import { IAlbum } from 'chord/music/api/album';

import { IPlayAlbumAct } from 'chord/workbench/api/common/action/player';

import { aliMusicApi } from 'chord/music/xiami/api';


export async function handlePlayAlbum(album: IAlbum): Promise<IPlayAlbumAct> {
    if (!album.songs || !album.songs.length ) {
        // TODO, Check album origin to pick correct api
        album = await aliMusicApi.album(album.albumOriginalId);
    }
    return {
        type: 'c:player:playAlbum',
        act: 'c:player:playAlbum',
        album,
    };
}
