'use strict';

import { equal } from 'chord/base/common/assert';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { IPlayCollectionAct } from 'chord/workbench/api/common/action/player';
import { CAudio } from 'chord/workbench/api/node/audio';


export function playCollection(state: IPlayerState, act: IPlayCollectionAct): IPlayerState {
    equal(act.act, 'c:player:playCollection');

    // Filter songs these have not audios;
    let playList = act.collection.songs.filter(song => song.audios.length > 0);
    let index = 0;
    let playing = false;

    if (playList && playList.length) {
        let audio = playList[0].audios.filter(audio => audio.format == 'mp3')[0];
        let audioUrl = audio.path || audio.url;
        CAudio.makeAudio(audioUrl);

        // play now
        CAudio.play();
        CAudio.volume(state.volume);
        playing = true;
    }
    return { ...state, playList, index, playing };
}
