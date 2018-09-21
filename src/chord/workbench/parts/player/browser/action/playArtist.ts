'use strict';

import { IArtist } from 'chord/music/api/artist';

import { IPlayArtistAct } from 'chord/workbench/api/common/action/player';

import { aliMusicApi } from 'chord/music/xiami/api';

import { filterSongWithAudios } from 'chord/workbench/api/utils/song';


export async function handlePlayArtist(artist: IArtist): Promise<IPlayArtistAct> {
    let songs = filterSongWithAudios(artist.songs);

    // default size of songs readed from settings
    if (songs.length < 50) {
        songs = await aliMusicApi.artistSongs(artist.artistOriginalId, 1, 50);
    }
    return {
        type: 'c:player:playArtist',
        act: 'c:player:playArtist',
        artist: { ...artist, songs },
    }
}
