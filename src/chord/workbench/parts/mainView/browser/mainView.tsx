'use strict';

import 'chord/css!./media/mainView';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import SearchView from 'chord/workbench/parts/mainView/browser/component/search/search';
import AlbumView from 'chord/workbench/parts/mainView/browser/component/album/album';
import ArtistView from 'chord/workbench/parts/mainView/browser/component/artist/artist';
import CollectionView from 'chord/workbench/parts/mainView/browser/component/collection/collection';
import LibraryView from 'chord/workbench/parts/mainView/browser/component/library/library';


function MainView({ view }) {
    console.log('+++ MainView view:', view);

    let View;
    switch (view) {
        case 'searchView':
            View = <SearchView />;
            break;
        case 'albumView':
            View = <AlbumView />
            break;
        case 'artistView':
            View = <ArtistView />
            break;
        case 'collectionView':
            View = <CollectionView />
            break;
        case 'libraryView':
            View = <LibraryView />
            break;
        default:
            console.warn(`[WARN] [MainView]: No get view: ${view}`);
            return null;
    }

    return (
        <div className='main-view-container'>
            {View}
        </div>
    );
}


function mapStateToProps(state: IStateGlobal) {
    return {
        view: state.mainView.view,
    }
}


export default connect(mapStateToProps)(MainView);
