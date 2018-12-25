'use strict';

import { equal } from 'chord/base/common/assert';

import { IHomeViewState } from 'chord/workbench/api/common/state/mainView/home/homeView';
import { IShowRecommendViewAct } from 'chord/workbench/api/common/action/home/recommend';


export function showRecommendView(state: IHomeViewState, act: IShowRecommendViewAct): IHomeViewState {
    equal(act.act, 'c:mainView:home:showRecommendView');

    let recommendViewState = { songs: act.songs, collections: act.collections };
    return { ...state, recommendView: recommendViewState, view: 'recommendView' };
}
