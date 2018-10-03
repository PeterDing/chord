'use strict';

import { ICollection } from 'chord/music/api/collection';

import { IAddLibraryCollectionAct } from 'chord/workbench/api/common/action/mainView';
import { IAddToQueueAct } from 'chord/workbench/api/common/action/player';
import { IRemoveFromLibraryAct } from 'chord/workbench/api/common/action/mainView';


export interface ICollectionMenuProps {
    view: string;

    top: number;
    left: number;
    collection: ICollection;

    handleAddLibraryCollection: (collection) => IAddLibraryCollectionAct;
    handleAddToQueue: (item: ICollection, direction: string) => Promise<IAddToQueueAct>;
    handleRemoveFromLibrary: (item: ICollection) => IRemoveFromLibraryAct;
}
