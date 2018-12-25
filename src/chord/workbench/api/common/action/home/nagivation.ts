'use strict';

import { Act } from 'chord/workbench/api/common/action/proto';


// For home view
export interface IChangeHomeViewAct extends Act {
    // 'c:mainView:home:navigation:changeView'
    type: string;
    act: string;
    view: string;
}
