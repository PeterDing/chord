'use strict';

import { IRewindAct, IPlayPauseAct, IForwardAct } from 'chord/workbench/api/common/action/player'


export interface IControllerProps {
    playing: boolean;
    rewind: () => IRewindAct;
    playPause: () => IPlayPauseAct;
    forward: () => IForwardAct;
}
