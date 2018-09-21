'use strict';

import { IAlbum } from 'chord/music/api/album';

import { IPlayAlbumAct } from 'chord/workbench/api/common/action/player';

import { aliMusicApi } from 'chord/music/xiami/api';

import { filterSongWithAudios } from 'chord/workbench/api/utils/song';


export async function handlePlayAlbum(album: IAlbum): Promise<IPlayAlbumAct> {
    let songs = filterSongWithAudios(album.songs);

    if (!songs.length) {
        // TODO, Check album origin to pick correct api
        let _album = await aliMusicApi.album(album.albumOriginalId);
        album.songs = _album.songs;
    }
    return {
        type: 'c:player:playAlbum',
        act: 'c:player:playAlbum',
        album,
    };
}
