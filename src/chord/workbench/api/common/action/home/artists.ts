'use strict';

import { Act } from 'chord/workbench/api/common/action/proto';


export interface IShowArtistListOptionsViewAct extends Act {
    // 'c:mainView:home:showArtistListOptionsView'
    type: string;
    act: string;
}


export interface IShowArtistListViewAct extends Act {
    // 'c:mainView:home:showArtistListView'
    type: string;
    act: string;

    origin: string;
}

