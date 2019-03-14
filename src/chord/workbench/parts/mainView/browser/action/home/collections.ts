'use strict';

import { Store } from 'redux';

import { ORIGIN } from 'chord/music/common/origin';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { makeOffsets, setCurrectOffset } from 'chord/workbench/api/utils/offset';

import { IOption } from 'chord/music/api/listOption';
import { IOffset, initiateOffset } from 'chord/workbench/api/common/state/offset';

import { IShowCollectionListOptionsViewAct, IShowCollectionListViewAct, IGetMoreCollectionsAct } from 'chord/workbench/api/common/action/home/collections';

import { musicApi } from 'chord/music/core/api';


export async function handleShowCollectionListOptionsView(): Promise<IShowCollectionListOptionsViewAct> {
    let store: Store = (<any>window).store;
    let state: IStateGlobal = store.getState();
    if (!!state.mainView.homeView.collectionsView.optionsSet.xiami) {
        return {
            type: 'c:mainView:home:showCollectionListOptionsView',
            act: 'c:mainView:home:showCollectionListOptionsView',

            optionsSet: null,
        };
    }

    let [xiamiOptions, neteaseOptions, qqOptions] = await Promise.all([
        musicApi.collectionListOptions(ORIGIN.xiami),
        musicApi.collectionListOptions(ORIGIN.netease),
        musicApi.collectionListOptions(ORIGIN.qq),
    ]);

    return {
        type: 'c:mainView:home:showCollectionListOptionsView',
        act: 'c:mainView:home:showCollectionListOptionsView',

        optionsSet: {
            [ORIGIN.xiami]: xiamiOptions,
            [ORIGIN.netease]: neteaseOptions,
            [ORIGIN.qq]: qqOptions,
        },
    };
}


export async function handleShowCollectionListView(origin: string, option: IOption, order: IOption, size: number = 50): Promise<IShowCollectionListViewAct> {
    let offset = initiateOffset();
    offset.limit = size;
    let orders = musicApi.collectionListOrders(origin);
    order = order || orders[0];

    let collections = await musicApi.collectionList(origin, option.id, order.id, offset.offset, offset.limit);

    if (collections.length == 0) {
        offset.more = false;
    }

    return {
        type: 'c:mainView:home:showCollectionListView',
        act: 'c:mainView:home:showCollectionListView',

        origin,
        option,

        orders,
        order,

        collections,
        collectionsOffset: offset,
    };
}


export async function handleGetMoreCollections(origin: string, option: IOption, order: IOption, offset: IOffset, size: number = 10): Promise<IGetMoreCollectionsAct> {
    let collections = [];
    if (offset.more) {
        let offsets = makeOffsets(origin, offset, size);
        let futs = offsets.map(_offset => musicApi.collectionList(origin, option.id, order.id, offset.offset, offset.limit));
        let collectionsList = await Promise.all(futs);
        collections = collections.concat(...collectionsList).slice(0, size);
        offset = setCurrectOffset(origin, offset, collections.length);
    }

    if (collections.length == 0) {
        offset.more = false;
    }

    return {
        type: 'c:mainView:home:collections:getMoreCollections',
        act: 'c:mainView:home:collections:getMoreCollections',

        collections,
        collectionsOffset: offset,
    };
}
