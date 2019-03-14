'use strict';

import { Act } from 'chord/workbench/api/common/action/proto';

import { IListOption, IOption } from 'chord/music/api/listOption';

import { ICollection } from 'chord/music/api/collection';

import { IOffset } from 'chord/workbench/api/common/state/offset';


export interface IShowCollectionListOptionsViewAct extends Act {
    // 'c:mainView:home:showCollectionListOptionsView'
    type: string;
    act: string;

    optionsSet: { [origin: string]: Array<IListOption> };
}

export interface IShowCollectionListViewAct extends Act {
    // 'c:mainView:home:showCollectionListView'
    type: string;
    act: string;

    origin: string;
    option: IOption;
    orders: Array<IOption>;
    order: IOption;

    collections: Array<ICollection>;
    collectionsOffset: IOffset;
}

export interface IGetMoreCollectionsAct extends Act {
    // 'c:mainView:home:collections:getMoreCollections'
    type: string;
    act: string;

    collections: Array<ICollection>;
    collectionsOffset: IOffset;
}
