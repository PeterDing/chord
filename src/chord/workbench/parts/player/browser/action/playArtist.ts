'use strict';

import { IArtist } from 'chord/music/api/artist';

import { IPlayArtistAct } from 'chord/workbench/api/common/action/player';

import { musicApi } from 'chord/music/core/api';

import { filterSongWithAudios } from 'chord/workbench/api/utils/song';


export async function handlePlayArtist(artist: IArtist): Promise<IPlayArtistAct> {
    let songs = filterSongWithAudios(artist.songs);

    // default size of songs readed from settings
    if (songs.length < 50) {
        songs = await musicApi.artistSongs(artist.artistId, 0, 50);
        if (!filterSongWithAudios(songs).length) {
            let songsAudios = await musicApi.songsAudios(songs.map(song => song.songId));
            songs.forEach((song, index) => song.audios = songsAudios[index]);
        }
    }

    return {
        type: 'c:player:playArtist',
        act: 'c:player:playArtist',
        artist: { ...artist, songs },
    }
}
