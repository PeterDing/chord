'use strict';

import { IAlbum } from 'chord/music/api/album';

import { IPlayAlbumAct } from 'chord/workbench/api/common/action/player';

import { filterSongWithAudios } from 'chord/workbench/api/utils/song';

import { musicApi } from 'chord/music/core/api';


export async function handlePlayAlbum(album: IAlbum): Promise<IPlayAlbumAct> {
    let songs = filterSongWithAudios(album.songs);

    if (!songs.length) {
        let _album = await musicApi.album(album.albumId);
        let _songs = _album.songs;
        if (!filterSongWithAudios(_songs).length) {
            let songsAudios = await musicApi.songsAudios(_songs.map(song => song.songId));
            _songs.forEach((song, index) => song.audios = songsAudios[index]);
        }
        album.songs = _songs;
    }

    return {
        type: 'c:player:playAlbum',
        act: 'c:player:playAlbum',
        album,
    };
}
