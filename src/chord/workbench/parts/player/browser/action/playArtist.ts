'use strict';

import { ORIGIN } from 'chord/music/common/origin';

import { IArtist } from 'chord/music/api/artist';

import { IPlayArtistAct } from 'chord/workbench/api/common/action/player';

import { musicApi } from 'chord/music/core/api';

import { hasSongAudio, addSongAudios, filterSongWithAudios } from 'chord/workbench/api/utils/song';


export async function handlePlayArtist(artist: IArtist): Promise<IPlayArtistAct> {
    let songs = filterSongWithAudios(artist.songs);

    if (songs.length < 50) {
        let _songs = await musicApi.artistSongs(artist.artistId, 0, 50);
        songs = _songs
            .filter(song => !song.disable)
            .filter(song => song.origin != ORIGIN.xiami || hasSongAudio(song));
    }

    if (songs.length) {
        await addSongAudios(songs[0]);
    }

    return {
        type: 'c:player:playArtist',
        act: 'c:player:playArtist',
        artist: { ...artist, songs },
    }
}
