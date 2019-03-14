'use strict';

import { ICollection } from 'chord/music/api/collection';
import { IListOption, IOption } from 'chord/music/api/listOption';
import { IOffset, initiateOffset } from 'chord/workbench/api/common/state/offset';


export interface ICollectionsViewState {
    // 'options' | 'collections'
    view: string;

    origin: string;

    optionsSet: { [origin: string]: Array<IListOption> };
    option: IOption;

    orders: Array<IOption>;
    order: IOption;

    collections: Array<ICollection>;
    collectionsOffset: IOffset;
}


export function initiateCollectionsViewState(): ICollectionsViewState {
    return {
        view: 'options',

        origin: null,

        optionsSet: {},
        option: null,

        orders: [],
        order: null,

        collections: [],
        collectionsOffset: initiateOffset(),
    };
}
