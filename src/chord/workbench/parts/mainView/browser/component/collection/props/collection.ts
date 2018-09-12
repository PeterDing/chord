'use strict';

import { ICollection } from 'chord/music/api/collection';
import { IPlayCollectionAct } from 'chord/workbench/api/common/action/player';


export interface ICollectionViewProps {
    collection: ICollection;
    handlePlayCollection: (collection: ICollection) => Promise<IPlayCollectionAct>;
}
