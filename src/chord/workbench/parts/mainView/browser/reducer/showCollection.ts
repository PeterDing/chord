'use strict';

import { equal } from 'chord/base/common/assert';

import { IShowCollectionAct } from 'chord/workbench/api/common/action/mainView';

import { ICollectionViewState } from 'chord/workbench/api/common/state/mainView/collectionView';


export function showCollectionView(state: ICollectionViewState, act: IShowCollectionAct): ICollectionViewState {
    equal(act.act, 'c:mainView:showCollectionView');

    return { collection: act.collection };
}
