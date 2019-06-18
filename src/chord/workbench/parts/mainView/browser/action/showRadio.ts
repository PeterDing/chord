'use strict';

import { IShowRadioAct } from 'chord/workbench/api/common/action/mainView';

import { IRadio } from 'chord/sound/api/radio';

import { soundApi } from 'chord/sound/core/api';


export async function handleShowRadioView(radio: IRadio): Promise<IShowRadioAct> {
    return {
        type: 'c:mainView:showRadioView',
        act: 'c:mainView:showRadioView',
        radio,
    };
}


export async function handleShowRadioViewById(radioId: string): Promise<IShowRadioAct> {
    let radio = await soundApi.radio(radioId);
    return handleShowRadioView(radio);
}
