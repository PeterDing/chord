'use strict';

import { Store } from 'redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { NOTICES } from 'chord/workbench/api/common/state/notification';
import { notice, noticeBlockedKbps } from 'chord/workbench/parts/notification/action/notice';

import { CAudio } from 'chord/workbench/api/node/audio';

import { Logger } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';

import { switchKbps } from 'chord/workbench/parts/player/browser/action/switchKbps';

import { handlePlay } from 'chord/workbench/parts/player/browser/action/playList';


const logger = new Logger(filenameToNodeName(__filename));


function switchLowerKbps() {
    let store: Store = (<any>window).store;

    let state: IStateGlobal = store.getState();
    let index = state.player.index;
    let playItem = state.player.playList[index];

    let preKbps = playItem.audios[0].kbps;

    logger.info('switch lower kbps:', playItem);

    if (switchKbps(-1)) {
        noticeBlockedKbps(playItem, preKbps);
        handlePlay(index).then(act => store.dispatch(act));
    } else {
        notice(NOTICES.NO_AUDIO, playItem);
        // play next playItem
        handlePlay(index + 1).then(act => store.dispatch(act));
    }
}


/**
 * Switch to lower kbps for audio loading error
 */
function onLoadError(soundId?: number, store?, audioUrl?: string, playItemId?: string) {
    CAudio.destroy();
    switchLowerKbps();
}


// CAudio.registerOnPlay('player.onPlay', onPlay);
CAudio.registerOnLoadError('player.onLoadError', onLoadError);
