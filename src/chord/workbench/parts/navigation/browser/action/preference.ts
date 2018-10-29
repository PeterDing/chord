'use strict';

import { IPreferenceViewAct } from 'chord/workbench/api/common/action/mainView';


export function handlePreference(): IPreferenceViewAct {
    return {
        type: 'c:mainView:preferenceView',
        act: 'c:mainView:preferenceView',
    }
}
