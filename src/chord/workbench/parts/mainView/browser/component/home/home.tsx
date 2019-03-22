'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import NagivationMenuView from 'chord/workbench/parts/mainView/browser/component/home/component/navigation/navigation';
import RecommendView from 'chord/workbench/parts/mainView/browser/component/home/component/recommend/recommendView';
import NewReleaseView from 'chord/workbench/parts/mainView/browser/component/home/component/newRelease/newReleaseView';
import CollectionsView from 'chord/workbench/parts/mainView/browser/component/home/component/collections/collections';
import AlbumsView from 'chord/workbench/parts/mainView/browser/component/home/component/albums/albums';


function HomeView({ view }) {
    let View;
    switch (view) {
        case 'recommendView':
            View = <RecommendView />;
            break;
        case 'newReleaseView':
            View = <NewReleaseView />;
            break;
        case 'collectionsView':
            View = <CollectionsView />;
            break;
        case 'albumsView':
            View = <AlbumsView />;
            break;

        default:
            throw new Error(`[HomeView]: unknown view: ${view}`);
    }

    return (
        <div className='hw-accelerate'>
            <section className='content'>

                <NagivationMenuView />
                {View}

            </section>
        </div>
    );
}


function mapStateToProps(state: IStateGlobal) {
    return {
        view: state.mainView.homeView.view,
    }
}

export default connect(mapStateToProps)(HomeView);
