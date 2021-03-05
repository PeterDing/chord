'use strict';

import { Store } from 'redux';

import { setBrowserGlobalProxy } from 'chord/base/browser/proxy';
import { hasChinaDomain } from 'chord/unity/api/blocked';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { NOTICES } from 'chord/workbench/api/common/state/notification';
import { notice, noticeBlockedKbps } from 'chord/workbench/parts/notification/action/notice';

import { CAudio } from 'chord/workbench/api/node/audio';

import { ORIGIN } from 'chord/music/common/origin';

import { Logger } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';

import { switchKbps } from 'chord/workbench/parts/player/browser/action/switchKbps';

import { handlePlay } from 'chord/workbench/parts/player/browser/action/playList';

import { selectAudio } from 'chord/workbench/api/utils/playItem';

import { appConfiguration } from 'chord/preference/configuration/app';


const logger = new Logger(filenameToNodeName(__filename));


function switchLowerKbps() {
    let store: Store = (<any>window).store;

    let state: IStateGlobal = store.getState();
    let index = state.player.index;
    let playItem = state.player.playList[index];

    let audio = selectAudio(playItem.audios);
    let preKbps = audio.kbps;

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
 * When radio url's domain is not from China, we try to use a proxy to request
 */
function handleBlockedByISP(): boolean {
    let proxy = appConfiguration.getConfig().proxy;
    if (!proxy) return false;

    let store: Store = (<any>window).store;

    let state: IStateGlobal = store.getState();
    let index = state.player.index;
    let playItem = state.player.playList[index];

    let audio = selectAudio(playItem.audios);
    if (!audio) return false;

    if (!hasChinaDomain(audio.url)) {
        setBrowserGlobalProxy(proxy);
        handlePlay(index).then(act => store.dispatch(act));
        return true;
    }

    return false;
}


function handleUrlExpire(): boolean {
    let store: Store = (<any>window).store;

    let state: IStateGlobal = store.getState();
    let index = state.player.index;
    let playItem = state.player.playList[index];

    // Kuwo url has an expire time
    if (playItem.origin == ORIGIN.kuwo) {
        playItem.audios.map(a => a.url = null);
    } else {
        return false;
    }

    let audio = selectAudio(playItem.audios);
    if (!audio) return false;

    handlePlay(index).then(act => store.dispatch(act));
    return true;
}


/**
 * Switch to lower kbps for audio loading error
 */
function onLoadError(soundId?: number, store?, audioUrl?: string, playItemId?: string) {
    CAudio.destroy();

    // if (handleBlockedByISP()) return;

    if (handleUrlExpire()) {
        return;
    }

    switchLowerKbps();
}


// CAudio.registerOnPlay('player.onPlay', onPlay);
CAudio.registerOnLoadError('player.onLoadError', onLoadError);
