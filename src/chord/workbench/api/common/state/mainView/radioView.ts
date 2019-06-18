'use strict';

import { IRadio } from 'chord/sound/api/radio';


export interface IRadioViewState {
    // 'overview' | 'episodes' | 'podcasts' | 'favoritePodcasts' | 'followings'
    view: string;

    radio: IRadio;
}

export function initiateRadioViewState(): IRadioViewState {
    return {
        view: 'overview',

        radio: null,
    };
}

