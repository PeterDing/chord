'use strict';

import { ORIGIN } from 'chord/music/common/origin';

import { IAlbum } from 'chord/music/api/album';

import { IPlayAlbumAct } from 'chord/workbench/api/common/action/player';

import { hasSongAudio, addSongAudios, filterSongWithAudios } from 'chord/workbench/api/utils/song';

import { musicApi } from 'chord/music/core/api';


export async function handlePlayAlbum(album: IAlbum): Promise<IPlayAlbumAct> {
    let songs = filterSongWithAudios(album.songs);

    if (!songs.length) {
        let _album = await musicApi.album(album.albumId);
        let _songs = _album.songs
            .filter(song => !song.disable)
            .filter(song => song.origin != ORIGIN.xiami || hasSongAudio(song));

        if (_songs.length) {
            await addSongAudios(_songs[0]);
        }
        album.songs = _songs;
    }

    return {
        type: 'c:player:playAlbum',
        act: 'c:player:playAlbum',
        album,
    };
}
