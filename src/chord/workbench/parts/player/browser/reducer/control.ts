'use strict';

import { equal } from 'chord/base/common/assert';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { IRewindAct, IPlayPauseAct, IForwardAct } from 'chord/workbench/api/common/action/player'
import { CAudio } from 'chord/workbench/api/node/audio';

import { selectAudio, PlayItem } from 'chord/workbench/api/utils/playItem';


export function rewind(state: IPlayerState, act: IRewindAct): IPlayerState {
    equal(act.act, 'c:player:rewind');

    if (state.index != null && state.index > 0) {
        // stop current audio
        if (CAudio.hasAudio()) {
            CAudio.stop();
        }

        let index = state.index - 1;
        let playItem = state.playList[index];

        // new audio
        // TODO: read kbps configuration
        let audio = selectAudio(playItem.audios);
        let audioUrl = audio.path || audio.url;
        CAudio.makeAudio(audioUrl, (new PlayItem(playItem)).id(), playItem.duration);
        // play now
        CAudio.play();
        CAudio.volume(state.volume);

        return { ...state, playing: true, index, kbps: audio.kbps };
    }
    return { ...state };
}

export function playPause(state: IPlayerState, act: IPlayPauseAct): IPlayerState {
    equal(act.act, 'c:player:playPause')

    if (CAudio.hasAudio()) {
        let playing = false;
        if (CAudio.playing()) {
            CAudio.pause();
        } else {
            CAudio.play();
            CAudio.volume(state.volume);
            playing = true;
        }
        return { ...state, playing };
    } else {
        // plays index's playItem
        if (state.playList.length != 0) {
            let index = state.index || 0;
            let playItem = state.playList[index];

            // new audio
            // TODO: read kbps configuration
            let audio = selectAudio(playItem.audios);
            let audioUrl = audio.path || audio.url;
            CAudio.makeAudio(audioUrl, (new PlayItem(playItem)).id(), playItem.duration);
            // play now
            CAudio.play();
            CAudio.volume(state.volume);
            return { ...state, playing: true, index, kbps: audio.kbps };
        }
        return { ...state, playing: false };
    }
}

export function forward(state: IPlayerState, act: IForwardAct): IPlayerState {
    equal(act.act, 'c:player:forward');

    if (state.index < state.playList.length - 1) {
        // stop current audio
        if (CAudio.hasAudio()) {
            CAudio.stop();
        }

        let index = state.index + 1;
        let playItem = state.playList[index];

        // new audio
        // TODO: read kbps configuration
        let audio = selectAudio(playItem.audios);
        let audioUrl = audio.path || audio.url;
        CAudio.makeAudio(audioUrl, (new PlayItem(playItem)).id(), playItem.duration);
        // play now
        CAudio.play();
        CAudio.volume(state.volume);

        return { ...state, playing: true, index, kbps: audio.kbps };
    }

    let playing = CAudio.hasAudio() ? CAudio.playing() : false;
    return { ...state, playing };
}
