'use strict';

import 'chord/css!./media/menu';

import * as React from 'react';

import SongMenu from 'chord/workbench/parts/menu/browser/component/songMenu';
import ArtistMenu from 'chord/workbench/parts/menu/browser/component/artistMenu';
import AlbumMenu from 'chord/workbench/parts/menu/browser/component/albumMenu';
import CollectionMenu from 'chord/workbench/parts/menu/browser/component/collectionMenu';
import UserProfileMenu from 'chord/workbench/parts/menu/browser/component/userProfileMenu';


function MenuView() {
    return (
        <div>
            <SongMenu />
            <ArtistMenu />
            <AlbumMenu />
            <CollectionMenu />
            <UserProfileMenu />
        </div>
    );
}


export default MenuView;
