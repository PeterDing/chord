'use strict';

import 'chord/css!./media/mainView';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import SearchView from 'chord/workbench/parts/mainView/browser/component/search/search';
import AlbumView from 'chord/workbench/parts/mainView/browser/component/album/album';
import ArtistView from 'chord/workbench/parts/mainView/browser/component/artist/artist';
import CollectionView from 'chord/workbench/parts/mainView/browser/component/collection/collection';


function MainView({ view }) {
    console.log('+++ MainView view:', view);
    if (view == 'searchView') {
        let View = <SearchView />;
        return (
            <div className='main-view-container'>
                {View}
            </div>
        );
    } else if (view == 'albumView') {
        let View = <AlbumView />
        return (
            <div className='main-view-container'>
                {View}
            </div>
        );
    } else if (view == 'artistView') {
        let View = <ArtistView />
        return (
            <div className='main-view-container'>
                {View}
            </div>
        );
    } else if (view == 'collectionView') {
        let View = <CollectionView />
        return (
            <div className='main-view-container'>
                {View}
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    return {
        view: state.mainView.view,
    }
}


export default connect(mapStateToProps)(MainView);
