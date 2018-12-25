'use strict';

import { IChangeHomeViewAct } from 'chord/workbench/api/common/action/home/nagivation';


export function changeView(view: string): IChangeHomeViewAct {
    return {
        type: 'c:mainView:home:navigation:changeView',
        act: 'c:mainView:home:navigation:changeView',
        view,
    };
}
