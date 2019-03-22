'use strict';

import { IRecommendViewState, initiateRecommendViewState } from 'chord/workbench/api/common/state/mainView/home/recommendView';
import { ICollectionsViewState, initiateCollectionsViewState } from 'chord/workbench/api/common/state/mainView/home/collectionsView';
import { IAlbumsViewState, initiateAlbumsViewState } from 'chord/workbench/api/common/state/mainView/home/albumsView';


export interface IHomeViewState {
    // 'recommendView' | 'collectionsView' | 'albumsView'
    // current view: 'recommendView'
    view: string;
    recommendView: IRecommendViewState;
    collectionsView: ICollectionsViewState;
    albumsView: IAlbumsViewState;
}


export function initiateHomeViewState(): IHomeViewState {
    return {
        view: 'recommendView',
        recommendView: initiateRecommendViewState(),
        collectionsView: initiateCollectionsViewState(),
        albumsView: initiateAlbumsViewState(),
    };
}
