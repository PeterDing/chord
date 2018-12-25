'use strict';

import { IRecommendViewState, initiateRecommendViewState } from 'chord/workbench/api/common/state/mainView/home/recommendView';


export interface IHomeViewState {
    // current view: 'recommendView'
    view: string;
    recommendView: IRecommendViewState;
}


export function initiateHomeViewState(): IHomeViewState {
    return {
        view: 'recommendView',
        recommendView: initiateRecommendViewState(),
    };
}
