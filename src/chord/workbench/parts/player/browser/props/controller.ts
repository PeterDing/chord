'use strict';

import { IPlayPauseAct, IPlayAct } from 'chord/workbench/api/common/action/player'


export interface IControllerProps {
    playing: boolean;
    rewind: () => Promise<IPlayAct>;
    playPause: () => Promise<IPlayPauseAct>;
    forward: () => Promise<IPlayAct>;
}
