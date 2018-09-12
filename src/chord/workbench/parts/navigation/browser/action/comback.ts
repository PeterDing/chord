'use strict';

import { INavigationComebackAct } from 'chord/workbench/api/common/action/navigation';


export function comeback(preView: string): INavigationComebackAct {
    return {
        type: 'c:mainView:comeback',
        act: 'c:mainView:comeback',
        view: preView,
    }
}
