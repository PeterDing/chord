'use strict';

import { Store } from 'redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';


/**
 * Switch song's audio to one which of kbps is equal less to @param kbps
 *
 * If kbps is -1, we switch to 2nd audio in audios
 */
export function switchKbps(kbps: number): boolean {
    let store: Store = (window as any).store;

    let state: IStateGlobal = store.getState();
    let playList = state.player.playList;
    let index = state.player.index;
    let song = playList[index];

    let audios;
    if (kbps == -1) {
        audios = song.audios.slice(1);
    } else {
        audios = song.audios.filter(audio => audio.kbps <= kbps);
    }

    if (audios.length == 0) {
        return false;
    };

    kbps = audios[0].kbps;
    song.audios = audios;
    return true;
}
