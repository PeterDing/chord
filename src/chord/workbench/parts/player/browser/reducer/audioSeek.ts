'use strict';

import { equal } from 'chord/base/common/assert';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { ISeekAct } from 'chord/workbench/api/common/action/player';
import { CAudio } from 'chord/workbench/api/node/audio';

export function audioSeek(state: IPlayerState, act: ISeekAct): IPlayerState {
    equal(act.act, 'c:player:seek');

    if (CAudio.hasAudio() && CAudio.playing()) {
        let duration = CAudio.duration();
        let seek = duration * act.percent;
        CAudio.seek(seek);
    }
    return state;
}
