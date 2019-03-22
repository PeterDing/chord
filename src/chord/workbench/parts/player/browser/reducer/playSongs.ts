'use strict';

import { ISong } from 'chord/music/api/song';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { CAudio } from 'chord/workbench/api/node/audio';

import { selectAudio } from 'chord/workbench/api/utils/song';


export function playSongs(state: IPlayerState, playList: Array<ISong>): IPlayerState {
    let index = 0;
    let playing = false;

    if (playList && playList.length) {
        let song = playList[0];
        // TODO: read kbps configuration
        let audio = selectAudio(song.audios);
        let audioUrl = audio.path || audio.url;
        CAudio.makeAudio(audioUrl, song.songId);

        // play now
        CAudio.play();
        CAudio.volume(state.volume);
        playing = true;
        return { ...state, playList, index, playing, kbps: audio.kbps, id: Date.now() };
    }
    return { ...state };
}
