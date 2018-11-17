'use strict';

import { ICollection } from 'chord/music/api/collection';
import { IPlayCollectionAct } from 'chord/workbench/api/common/action/player';
import { IShowCollectionMenuAct } from 'chord/workbench/api/common/action/menu';
import { IShowUserProfileAct } from 'chord/workbench/api/common/action/mainView';


export interface ICollectionViewProps {
    collection: ICollection;
    handlePlayCollection: (collection: ICollection) => Promise<IPlayCollectionAct>;
    handleShowUserProfileViewById: (userId: string, userMid: string) => Promise<IShowUserProfileAct>;
    showCollectionMenu: (e: React.MouseEvent<HTMLDivElement>, collection: ICollection) => IShowCollectionMenuAct;
}
