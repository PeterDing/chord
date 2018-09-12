'use strict';

import { ICollection } from 'chord/music/api/collection';
import { IPlayCollectionAct } from 'chord/workbench/api/common/action/player';
import { IShowCollectionAct } from 'chord/workbench/api/common/action/mainView';


export interface ICollectionItemViewProps {
    collection: ICollection;
    handlePlayCollection: (collection: ICollection) => Promise<IPlayCollectionAct>;
    handleShowCollectionView: (collection: ICollection) => Promise<IShowCollectionAct>;
}
