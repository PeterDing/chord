'use strict';

import { equal } from 'chord/base/common/assert';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { IVolumeAct } from 'chord/workbench/api/common/action/player';
import { CAudio } from 'chord/workbench/api/node/audio';


export function changeVolume(state: IPlayerState, act: IVolumeAct): IPlayerState {
    equal(act.act, 'c:player:volume');

    // Update the global volume (affecting all Howls).
    let volume = act.volume;
    CAudio.volume(volume);
    return { ...state, volume };
}
