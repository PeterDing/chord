'use strict';

import { ICollection } from 'chord/music/api/collection';
import { IPlayCollectionAct } from 'chord/workbench/api/common/action/player';
import { IShowCollectionMenuAct } from 'chord/workbench/api/common/action/menu';


export interface ICollectionViewProps {
    collection: ICollection;
    handlePlayCollection: (collection: ICollection) => Promise<IPlayCollectionAct>;
    showCollectionMenu: (e: React.MouseEvent<HTMLDivElement>, collection: ICollection) => IShowCollectionMenuAct;
}
