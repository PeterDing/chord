'use strict';

import { IRadio } from 'chord/sound/api/radio';


export interface IRadioMenuState {
    top: number;
    left: number;

    radio: IRadio;
}


export function initiateRadioMenuState(): IRadioMenuState {
    return {
        top: 0,
        left: 0,
        radio: null,
    };
}
