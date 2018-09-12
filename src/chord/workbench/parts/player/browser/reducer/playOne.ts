'use strict';

import { equal } from 'chord/base/common/assert';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { IPlayOneAct } from 'chord/workbench/api/common/action/player';
import { CAudio } from 'chord/workbench/api/node/audio';


export function playOne(state: IPlayerState, act: IPlayOneAct): IPlayerState {
    equal(act.act, 'c:player:playOne');

    // Filter song which has not audio
    if (act.song.audios.length == 0) {
        return { ...state };
    }

    let playList = [act.song];
    let index = 0;

    let audio = act.song.audios.filter(audio => audio.format == 'mp3')[0];
    let audioUrl = audio.path || audio.url;

    // TODO: audio is blocked by service
    // if (!audioUrl) {
    // return state;
    // }

    CAudio.makeAudio(audioUrl);

    // play now
    CAudio.play();
    CAudio.volume(state.volume);
    return { ...state, playing: true, playList, index };
}
