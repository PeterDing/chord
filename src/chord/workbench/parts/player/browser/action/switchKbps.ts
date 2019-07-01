'use strict';

import { Store } from 'redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { selectAudio } from 'chord/workbench/api/utils/playItem';


/**
 * Switch playItem's audio to one which of kbps is equal less to @param kbps
 *
 * If kbps is -1, we switch to 2nd audio in audios
 */
export function switchKbps(kbps: number): boolean {
    let store: Store = (window as any).store;

    let state: IStateGlobal = store.getState();
    let playList = state.player.playList;
    let index = state.player.index;
    let playItem = playList[index];

    let audio = selectAudio(playItem.audios);
    let audios = playItem.audios.filter(a => a.kbps <= audio.kbps);

    if (kbps == -1) {
        audios = audios.slice(1);
    } else {
        audios = audios.filter(audio => audio.kbps <= kbps);
    }

    if (audios.length == 0) {
        return false;
    };

    kbps = audios[0].kbps;
    playItem.audios = audios;
    return true;
}
