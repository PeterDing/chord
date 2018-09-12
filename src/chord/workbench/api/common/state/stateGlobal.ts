'use strict';

import { IPlayerState, initiatePlayerState } from 'chord/workbench/api/common/state/player';
import { IMainViewState, initiateMainViewState } from 'chord/workbench/api/common/state/mainView/mainView';


export interface IStateGlobal {
    player: IPlayerState;
    mainView: IMainViewState;
}

/**
 * Chord global state from redux
 */
export function initiateStateGlobal(): IStateGlobal {
    return {
        player: initiatePlayerState(),
        mainView: initiateMainViewState(),
    };
}
