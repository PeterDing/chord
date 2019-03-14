'use strict';

import { equal } from 'chord/base/common/assert';

import { IHomeViewState } from 'chord/workbench/api/common/state/mainView/home/homeView';
import { ICollectionsViewState } from 'chord/workbench/api/common/state/mainView/home/collectionsView';
import {
    IShowCollectionListOptionsViewAct,
    IShowCollectionListViewAct,
    IGetMoreCollectionsAct
} from 'src/chord/workbench/api/common/action/home/collections';


export function showCollectionListOptions(state: IHomeViewState, act: IShowCollectionListOptionsViewAct): IHomeViewState {
    equal(act.act, 'c:mainView:home:showCollectionListOptionsView');

    let optionsSet = act.optionsSet;
    if (!!optionsSet) {
        return {
            ...state,
            view: 'collectionsView',
            collectionsView: {
                ...state.collectionsView,
                view: 'options',
                optionsSet,
            }
        };
    } else {
        return {
            ...state,
            view: 'collectionsView',
            collectionsView: {
                ...state.collectionsView,
                view: 'options',
            }
        };
    }
}


export function showCollectionListView(state: ICollectionsViewState, act: IShowCollectionListViewAct): ICollectionsViewState {
    equal(act.act, 'c:mainView:home:showCollectionListView');

    let { origin, option, orders, order, collections, collectionsOffset } = act;
    return {
        ...state,
        view: 'collections',
        origin,
        option,
        orders,
        order,
        collections,
        collectionsOffset
    };
}


export function getMoreCollections(state: ICollectionsViewState, act: IGetMoreCollectionsAct): ICollectionsViewState {
    equal(act.act, 'c:mainView:home:collections:getMoreCollections');

    let { collections, collectionsOffset } = act;
    return {
        ...state,
        view: 'collections',
        collections: [...state.collections, ...collections],
        collectionsOffset
    };
}
