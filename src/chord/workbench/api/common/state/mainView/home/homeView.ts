'use strict';

import { IRecommendViewState, initiateRecommendViewState } from 'chord/workbench/api/common/state/mainView/home/recommendView';
import { ICollectionsViewState, initiateCollectionsViewState } from 'chord/workbench/api/common/state/mainView/home/collectionsView';


export interface IHomeViewState {
    // 'recommendView' | 'collectionsView'
    // current view: 'recommendView'
    view: string;
    recommendView: IRecommendViewState;
    collectionsView: ICollectionsViewState;
}


export function initiateHomeViewState(): IHomeViewState {
    return {
        view: 'recommendView',
        recommendView: initiateRecommendViewState(),
        collectionsView: initiateCollectionsViewState(),
    };
}
