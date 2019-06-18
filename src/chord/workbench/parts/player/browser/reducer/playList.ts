'use strict';

import { equal } from 'chord/base/common/assert';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { IPlayAct } from 'chord/workbench/api/common/action/player';
import { CAudio } from 'chord/workbench/api/node/audio';

import { PlayItem } from 'chord/workbench/api/utils/playItem';

import { selectAudio } from 'chord/workbench/api/utils/playItem';

import { removeGlobelPlayPart } from 'chord/workbench/events/autoLoadNextPlayItems';


export function playAudio(state: IPlayerState, act: IPlayAct): IPlayerState {
    equal(act.act, 'c:player:play');

    let index = act.index;
    if (!(index == state.index && CAudio.hasAudio() && CAudio.playing())) {
        let playItem = state.playList[index];
        if (playItem) {
            // remove auto-load next playing items for song
            if (playItem.type == 'song') removeGlobelPlayPart();

            // TODO: read kbps configuration
            let audio = selectAudio(playItem.audios);
            let audioUrl = audio.path || audio.url;
            CAudio.makeAudio(audioUrl, (new PlayItem(playItem)).id());

            // play now
            CAudio.play();
            CAudio.volume(state.volume);

            return { ...state, playing: true, index, kbps: audio.kbps };
        }
    }
    let playing = CAudio.hasAudio() ? CAudio.playing() : false;
    return { ...state, playing };
}
