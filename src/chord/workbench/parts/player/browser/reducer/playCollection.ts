'use strict';

import { equal } from 'chord/base/common/assert';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { IPlayCollectionAct } from 'chord/workbench/api/common/action/player';
import { playItems } from 'chord/workbench/parts/player/browser/reducer/playItems';


export function playCollection(state: IPlayerState, act: IPlayCollectionAct): IPlayerState {
    equal(act.act, 'c:player:playCollection');

    let playList = act.collection.songs;
    return playItems(state, playList);
}
