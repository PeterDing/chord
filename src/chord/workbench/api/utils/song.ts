'use strict';

import { ISong } from 'chord/music/api/song';


export function hasSongAudio(song: ISong): boolean {
    for (let audio of song.audios) {
        return !!(audio.url || audio.path);
    }
    return false;
}

export function filterSongWithAudios(songs: Array<ISong>): Array<ISong> {
    return songs.filter(song => hasSongAudio(song));
}
