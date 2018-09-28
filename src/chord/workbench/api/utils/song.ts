'use strict';

import { ORIGIN } from 'chord/music/common/origin';

import { ISong } from 'chord/music/api/song';

import { musicApi } from 'chord/music/core/api';


export function hasSongAudioPath(song: ISong): boolean {
    for (let audio of song.audios) {
        return !!(audio.path);
    }
    return false;
}

export function hasSongAudio(song: ISong): boolean {
    for (let audio of song.audios) {
        return !!(audio.url || audio.path);
    }
    return false;
}

export function filterSongWithAudios(songs: Array<ISong>): Array<ISong> {
    return songs.filter(song => hasSongAudio(song));
}

export async function addSongAudios(song: ISong) {
    // netease's audio needs to be got by realtime
    if (song.origin == ORIGIN.netease) {
        if (!hasSongAudioPath(song)) {
            song.audios = await musicApi.audios(song.songId);
        }
    } else {
        if (!hasSongAudio(song)) {
            song.audios = await musicApi.audios(song.songId);
        }
    }
}
