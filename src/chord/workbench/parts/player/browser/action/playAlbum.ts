'use strict';

import { ORIGIN } from 'chord/music/common/origin';

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';

import { IPlayAlbumAct } from 'chord/workbench/api/common/action/player';

import { hasPlayItemAudio, addPlayItemAudiosIter } from 'chord/workbench/api/utils/playItem';

import { noticePlayItem } from 'chord/workbench/parts/notification/action/notice';

import { musicApi } from 'chord/music/core/api';


export async function handlePlayAlbum(album: IAlbum): Promise<IPlayAlbumAct> {
    let songs = album.songs || [];
    let count = album.songCount || songs.length;

    if (!songs.length) {
        let _album = await musicApi.album(album.albumId);
        count = _album.songCount || _album.songs.length;
        songs = _album.songs
            .filter(song => !song.disable);
        // .filter(song => (song.origin != ORIGIN.xiami) || hasPlayItemAudio(song));
    }

    songs = (await addPlayItemAudiosIter(songs)) as Array<ISong>;

    noticePlayItem(album, count, count - songs.length);

    return {
        type: 'c:player:playAlbum',
        act: 'c:player:playAlbum',
        album: { ...album, songs },
    };
}
