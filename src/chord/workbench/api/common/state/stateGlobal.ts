'use strict';

import { IPlayerState, initiatePlayerState } from 'chord/workbench/api/common/state/player';
import { IMainViewState, initiateMainViewState } from 'chord/workbench/api/common/state/mainView/mainView';
import { IMenuState, initiateMenuState } from 'chord/workbench/api/common/state/menu/menu';


export interface IStateGlobal {
    player: IPlayerState;
    mainView: IMainViewState;
    menu: IMenuState;
}

/**
 * Chord global state from redux
 */
export function initiateStateGlobal(): IStateGlobal {
    return {
        player: initiatePlayerState(),
        mainView: initiateMainViewState(),
        menu: initiateMenuState(),
    };
}
