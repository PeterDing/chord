'use strict';

import { ICollection } from 'chord/music/api/collection';
import { IPlayCollectionAct } from 'chord/workbench/api/common/action/player';
import { IShowCollectionAct } from 'chord/workbench/api/common/action/mainView';
import { IShowCollectionMenuAct } from 'chord/workbench/api/common/action/menu';
import { IShowUserProfileAct } from 'chord/workbench/api/common/action/mainView';


export interface ICollectionItemViewProps {
    collection: ICollection;
    handlePlayCollection: (collection: ICollection) => Promise<IPlayCollectionAct>;
    handleShowCollectionView: (collection: ICollection) => Promise<IShowCollectionAct>;
    showCollectionMenu: (e: React.MouseEvent<HTMLDivElement>, collection: ICollection) => IShowCollectionMenuAct;

    handleShowUserProfileViewById: (userId: string, userMid: string, userName: string) => Promise<IShowUserProfileAct>;
}
