'use strict';

import { equal } from 'chord/base/common/assert';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { IPlayAct } from 'chord/workbench/api/common/action/player';
import { CAudio } from 'chord/workbench/api/node/audio';


export function playAudio(state: IPlayerState, act: IPlayAct): IPlayerState {
    equal(act.act, 'c:player:play');

    let index = act.index;
    if (!(index == state.index && CAudio.hasAudio() && CAudio.playing())) {
        let song = state.playList[index];
        if (song) {
            let audio = song.audios.filter(audio => audio.format == 'mp3')[0];
            let audioUrl = audio.path || audio.url;
            CAudio.makeAudio(audioUrl);

            // play now
            CAudio.play();
            CAudio.volume(state.volume);

            return { ...state, playing: true, index, kbps: audio.kbps };
        }
    }
    let playing = CAudio.hasAudio() ? CAudio.playing() : false;
    return { ...state, playing };
}
