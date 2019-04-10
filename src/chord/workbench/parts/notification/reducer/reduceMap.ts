'use strict';

import { IReducerMap } from 'chord/workbench/api/common/reducer/reducerMap';
import { addNotice } from 'chord/workbench/parts/notification/reducer/notice';


export function map(act: string): IReducerMap {
    switch (act) {
        case 'c:notification:notice':
            return {
                reducer: addNotice,
                node: '.',
            };
        default:
            return null;
    }
}

