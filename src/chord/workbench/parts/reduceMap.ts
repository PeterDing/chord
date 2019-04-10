'use strict';

import { IReducerMap } from 'chord/workbench/api/common/reducer/reducerMap';
import { playerReducer } from 'chord/workbench/parts/player/browser/reducer/main';
import { mainViewReducer } from 'chord/workbench/parts/mainView/browser/reducer/main'
import { menuReducer } from 'chord/workbench/parts/menu/browser/reducer/main';
import { notificationReducer } from 'chord/workbench/parts/notification/reducer/main';


export function map(act: string): IReducerMap {
    if (act.startsWith('c:player:')) {
        return {
            reducer: playerReducer,
            node: 'player',
        };
    } else if (act.startsWith('c:mainView:')) {
        return {
            reducer: mainViewReducer,
            node: 'mainView',
        };
    } else if (act.startsWith('c:notification:')) {
        return {
            reducer: notificationReducer,
            node: 'notification',
        };
    } else if (act.startsWith('c:menu:')) {
        return {
            reducer: menuReducer,
            node: 'menu',
        };
    } else {
        return null;
    }
}
