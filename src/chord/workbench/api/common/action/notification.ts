'use strict';

import { Act } from 'chord/workbench/api/common/action/proto';
import { INotice } from 'chord/workbench/api/common/state/notification';


export interface INoticeAct extends Act {
    // 'c:notification:notice'
    type: string;
    act: string;

    notice: INotice<any>;
}
