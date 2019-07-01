'use strict';

import { getOrigin } from 'chord/music/common/origin';

import { IShowRadioAct } from 'chord/workbench/api/common/action/mainView';

import { IRadio } from 'chord/sound/api/radio';

import { soundApi } from 'chord/sound/core/api';

import { noticeInfo } from 'chord/workbench/parts/notification/action/notice';


export async function handleShowRadioView(radio: IRadio): Promise<IShowRadioAct> {
    return {
        type: 'c:mainView:showRadioView',
        act: 'c:mainView:showRadioView',
        radio,
    };
}


export async function handleShowRadioViewById(radioId: string): Promise<IShowRadioAct> {
    let radio = await soundApi.radio(radioId);
    if (!radio) {
        let { origin } = getOrigin(radioId);
        noticeInfo('Radio', origin + ` hasn't radios`);
        return null;
    }
    return handleShowRadioView(radio);
}
