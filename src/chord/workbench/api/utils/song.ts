'use strict';

import { ISong } from 'chord/music/api/song';
import { IAudio } from 'chord/music/api/audio';

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
    // netease and qq's audio url needs to be got by realtime
    if (!hasSongAudio(song)) {
        song.audios = await musicApi.audios(song.songId);
    }
}

export async function addSongAudiosIter(songs: Array<ISong>): Promise<Array<ISong>> {
    for (let index = 0; index < songs.length; index += 1) {
        let song = songs[index];
        await addSongAudios(song);
        if (hasSongAudio(song)) {
            return songs.slice(index);
        }
    }
    return [];
}


/**
 * Select the audio file which is less than or equal to the given supper kbps from a list
 *
 * maximum of kbps
 * https://en.wikipedia.org/wiki/Bit_rate
 */
export function selectAudio(audios: Array<IAudio>, supKbps: number = 6000): IAudio {
    if (audios.length == 0) return null;

    return audios.filter(audio =>
        (audio.url || audio.path)
        && (audio.format != 'ape')  // howler does not support `ape` audio format
        && ((audio.kbps || 128) <= supKbps)
    ).sort((x, y) => y.kbps - x.kbps)[0];
}
