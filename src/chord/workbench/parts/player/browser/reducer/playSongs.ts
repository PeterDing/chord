'use strict';

import { ISong } from 'chord/music/api/song';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { CAudio } from 'chord/workbench/api/node/audio';


export function playSongs(state: IPlayerState, playList: Array<ISong>): IPlayerState {
    let index = 0;
    let playing = false;

    if (playList && playList.length) {
        let song = playList[0];
        let audio = song.audios.filter(audio => (audio.path || audio.url) && audio.format == 'mp3')[0];
        let audioUrl = audio.path || audio.url;
        CAudio.makeAudio(audioUrl);

        // play now
        CAudio.play();
        CAudio.volume(state.volume);
        playing = true;
        return { ...state, playList, index, playing, kbps: audio.kbps, id: Date.now() };
    }
    return { ...state };
}
