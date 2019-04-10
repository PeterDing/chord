'use strict';

import { equal } from 'chord/base/common/assert';
import { INotificationState } from 'chord/workbench/api/common/state/notification';
import { INoticeAct } from 'chord/workbench/api/common/action/notification';


const MAX_SIZE = 10;

export function addNotice(state: INotificationState, act: INoticeAct): INotificationState {
    equal(act.act, 'c:notification:notice');

    let { notice } = act;
    let entries = state.entries.slice(0, MAX_SIZE);
    return { entries: [notice, ...entries] };
}
