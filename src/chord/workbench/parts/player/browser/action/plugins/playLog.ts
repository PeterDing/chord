'use strict';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { IOriginConfiguration } from 'chord/preference/api/user';
import { userConfiguration } from 'chord/preference/configuration/user';

import { PlayItem } from 'chord/workbench/api/utils/playItem';

import { musicApi } from 'chord/music/core/api';


export async function handlePlayLog(): Promise<boolean> {
    let state: IStateGlobal = (window as any).store.getState();
    let playList = state.player.playList;
    let index = state.player.index;

    if (!playList.length) {
        return false;
    }

    let playItem = playList[index];
    let duration = playItem.duration || 120;
    let config = userConfiguration.getConfig();
    let { account, syncAddRemove }: IOriginConfiguration = config[playItem.origin] || {};
    if (account && syncAddRemove) {
        return musicApi.playLog((new PlayItem(playItem)).id(), duration);
    } else {
        return true;
    }
}
