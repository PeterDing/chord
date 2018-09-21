'use strict';

import { ICollection } from 'chord/music/api/collection';

import { IAddLibraryCollectionAct } from 'chord/workbench/api/common/action/mainView';


export interface ICollectionMenuProps {
    view: string;

    top: number;
    left: number;
    collection: ICollection;

    handleAddLibraryCollection: (collection) => IAddLibraryCollectionAct;
}
