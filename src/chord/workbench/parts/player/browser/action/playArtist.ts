'use strict';

import { ORIGIN } from 'chord/music/common/origin';

import { IArtist } from 'chord/music/api/artist';

import { IPlayArtistAct } from 'chord/workbench/api/common/action/player';

import { musicApi } from 'chord/music/core/api';

import { hasSongAudio, addSongAudiosIter } from 'chord/workbench/api/utils/song';

import { noticePlayItem } from 'chord/workbench/parts/notification/action/notice';


export async function handlePlayArtist(artist: IArtist): Promise<IPlayArtistAct> {
    let songs = artist.songs || [];
    let count = songs.length;

    if (songs.length < 100) {
        let _songs = await musicApi.artistSongs(artist.artistId, 0, 100);
        count = _songs.length;
        songs = _songs
            .filter(song => !song.disable)
            .filter(song => song.origin != ORIGIN.xiami || hasSongAudio(song));
    }

    songs = await addSongAudiosIter(songs);

    noticePlayItem(artist, count, count - songs.length);

    return {
        type: 'c:player:playArtist',
        act: 'c:player:playArtist',
        artist: { ...artist, songs },
    }
}
