'use strict';

import 'chord/css!./media/menu';

import * as React from 'react';

import SongMenu from 'chord/workbench/parts/menu/browser/component/songMenu';
import ArtistMenu from 'chord/workbench/parts/menu/browser/component/artistMenu';
import AlbumMenu from 'chord/workbench/parts/menu/browser/component/albumMenu';
import CollectionMenu from 'chord/workbench/parts/menu/browser/component/collectionMenu';
import UserProfileMenu from 'chord/workbench/parts/menu/browser/component/userProfileMenu';

import EpisodeMenu from 'chord/workbench/parts/menu/browser/component/episodeMenu';
import PodcastMenu from 'chord/workbench/parts/menu/browser/component/podcastMenu';
import RadioMenu from 'chord/workbench/parts/menu/browser/component/radioMenu';


function MenuView() {
    return (
        <div>
            <SongMenu />
            <ArtistMenu />
            <AlbumMenu />
            <CollectionMenu />
            <UserProfileMenu />

            <EpisodeMenu />
            <PodcastMenu />
            <RadioMenu />
        </div>
    );
}


export default MenuView;
