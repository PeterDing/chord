'use strict';

import { IReducerMap } from 'chord/workbench/api/common/reducer/reducerMap';

import {
    showSongMenu,
    showArtistMenu,
    showAlbumMenu,
    showCollectionMenu,
    showUserProfileMenu,

    showEpisodeMenu,
    showPodcastMenu,
    showRadioMenu,
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
        case 'c:menu:showUserProfileMenu':
            return {
                reducer: showUserProfileMenu,
                node: 'userProfileMenu',
            };

        // Sound
        case 'c:menu:showEpisodeMenu':
            return {
                reducer: showEpisodeMenu,
                node: 'episodeMenu',
            };
        case 'c:menu:showPodcastMenu':
            return {
                reducer: showPodcastMenu,
                node: 'podcastMenu',
            };
        case 'c:menu:showRadioMenu':
            return {
                reducer: showRadioMenu,
                node: 'radioMenu',
            };

        default:
            return null;

    }
}
