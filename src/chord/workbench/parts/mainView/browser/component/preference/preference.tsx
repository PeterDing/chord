'use strict';

import * as React from 'react';

import { XiamiLogin, NeteaseLogin, QQLogin } from 'chord/workbench/parts/mainView/browser/component/preference/user/login';


export default function PreferenceView() {
    return (
        <div>
            <XiamiLogin />
            <NeteaseLogin />
            <QQLogin />
        </div>
    );
}
