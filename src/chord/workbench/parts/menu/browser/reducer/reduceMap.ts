'use strict';

import { IReducerMap } from 'chord/workbench/api/common/reducer/reducerMap';

import {
    showSongMenu,
    showArtistMenu,
    showAlbumMenu,
    showCollectionMenu,
} from 'chord/workbench/parts/menu/browser/reducer/show';


export function map(act: string): IReducerMap {
    switch (act) {
        case 'c:menu:showSongMenu':
            return {
                reducer: showSongMenu,
                node: 'songMenu',
            };
        case 'c:menu:showArtistMenu':
            return {
                reducer: showArtistMenu,
                node: 'artistMenu',
            };
        case 'c:menu:showAlbumMenu':
            return {
                reducer: showAlbumMenu,
                node: 'albumMenu',
            };
        case 'c:menu:showCollectionMenu':
            return {
                reducer: showCollectionMenu,
                node: 'collectionMenu',
            };

        default:
            return null;

        }
}
