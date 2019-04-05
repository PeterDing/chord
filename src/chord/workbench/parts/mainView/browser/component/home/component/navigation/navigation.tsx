'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { IShowRecommendViewAct } from 'chord/workbench/api/common/action/home/recommend';
import { IChangeHomeViewAct } from 'chord/workbench/api/common/action/home/nagivation';
import { IShowCollectionListOptionsViewAct } from 'src/chord/workbench/api/common/action/home/collections';
import { IShowAlbumListOptionsViewAct } from 'src/chord/workbench/api/common/action/home/albums';
import { IShowArtistListOptionsViewAct } from 'src/chord/workbench/api/common/action/home/artists';

import { changeView } from 'chord/workbench/parts/mainView/browser/action/home/nagivation';
import { handleShowRecommendView } from 'chord/workbench/parts/mainView/browser/action/home/recommend';
import { handleShowCollectionListOptionsView } from 'chord/workbench/parts/mainView/browser/action/home/collections';
import { handleShowAlbumListOptionsView } from 'chord/workbench/parts/mainView/browser/action/home/albums';
import { handleShowArtistListOptionsView } from 'chord/workbench/parts/mainView/browser/action/home/artists';


interface INagivationMenuViewProps {
    view: string;
    changeView: (view) => IChangeHomeViewAct;
    handleShowRecommendView: () => Promise<IShowRecommendViewAct>;
    handleShowCollectionListOptionsView: () => Promise<IShowCollectionListOptionsViewAct>;
    handleShowAlbumListOptionsView: () => Promise<IShowAlbumListOptionsViewAct>;
    handleShowArtistListOptionsView: () => IShowArtistListOptionsViewAct;
}


// over, recommendView, newReleaseView, rankingView, entriesView, stylesView
function NagivationMenuView(props: INagivationMenuViewProps) {
    let view = props.view;
    return (
        <nav className='search-nav-container'>
            <ul className='search-nav-ul'>
                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle cursor-pointer ${view == 'recommendView' ? 'search-nav-item__active' : ''}`}
                        onClick={() => props.handleShowRecommendView()}>
                        RECOMMEND</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle cursor-pointer ${view == 'newReleaseView' ? 'search-nav-item__active' : ''}`}
                        onClick={() => props.changeView('newReleaseView')}>
                        NEW RELEASES</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle cursor-pointer ${view == 'collectionsView' ? 'search-nav-item__active' : ''}`}
                        onClick={() => props.handleShowCollectionListOptionsView()}>
                        COLLECTIONS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle cursor-pointer ${view == 'albumsView' ? 'search-nav-item__active' : ''}`}
                        onClick={() => props.handleShowAlbumListOptionsView()}>
                        ALBUMS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle cursor-pointer ${view == 'artistsView' ? 'search-nav-item__active' : ''}`}
                        onClick={() => props.handleShowArtistListOptionsView()}>
                        ARTISTS</div>
                </li>
            </ul>
        </nav>
    );
}


function mapStateToProps(state: IStateGlobal) {
    return {
        view: state.mainView.homeView.view,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeView: (view) => dispatch(changeView(view)),
        handleShowRecommendView: () => handleShowRecommendView().then(act => dispatch(act)),
        handleShowCollectionListOptionsView: () => handleShowCollectionListOptionsView().then(act => dispatch(act)),
        handleShowAlbumListOptionsView: () => handleShowAlbumListOptionsView().then(act => dispatch(act)),
        handleShowArtistListOptionsView: () => dispatch(handleShowArtistListOptionsView()),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(NagivationMenuView);
