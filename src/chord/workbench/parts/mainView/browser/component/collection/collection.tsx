'use strict';

import 'chord/css!../../media/collection';

import * as React from 'react';
import { connect } from 'react-redux';

import { getLikeAndPlayCount } from 'chord/workbench/api/utils/statistic';

import { ESize } from 'chord/music/common/size';

import { getDateYear } from 'chord/base/common/time';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { CollectionIcon } from 'chord/workbench/parts/common/component/common';

import SongItemView from 'chord/workbench/parts/common/component/songItem';

import { handlePlayCollection } from 'chord/workbench/parts/player/browser/action/playCollection';

import { ICollectionViewProps } from 'chord/workbench/parts/mainView/browser/component/collection/props/collection';

import { showCollectionMenu } from 'chord/workbench/parts/menu/browser/action/menu';

import { handleShowUserProfileViewById } from 'chord/workbench/parts/mainView/browser/action/showUserProfile';

import { musicApi } from 'chord/music/core/api';


function CollectionEntity({ collection, handlePlayCollection, showCollectionMenu, handleShowUserProfileViewById }) {
    let cover = collection.collectionCoverPath || musicApi.resizeImageUrl(collection.origin, collection.collectionCoverUrl, ESize.Large);
    return (
        <header className='entity-info'>
            <div>
                <div draggable={true}>
                    <div className="media-object">
                        <div className="media-object-hoverable">
                            <div className="react-contextmenu-wrapper"
                                onContextMenu={(e) => showCollectionMenu(e, collection)}>

                                <div className="cover-art shadow cover-art--with-auto-height" aria-hidden="true"
                                    style={{ width: 'auto', height: 'auto' }}>
                                    <div>
                                        {CollectionIcon}
                                        <div className="cover-art-image cover-art-image-loaded"
                                            style={{ backgroundImage: `url("${cover}")` }}></div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CollectionInfo
                collection={collection}
                handlePlayCollection={handlePlayCollection}
                handleShowUserProfileViewById={handleShowUserProfileViewById} />
        </header>
    );
}


function CollectionInfo({ collection, handlePlayCollection, handleShowUserProfileViewById }) {
    let likeAndPlayCount = getLikeAndPlayCount(collection);
    return (
        <div className='media-bd'>
            <div className='entity-name'>
                <h2>{collection.collectionName}</h2>
                <div>
                    <span>By </span>
                    <span className='link-subtle a-like cursor-pointer'
                        onClick={() => handleShowUserProfileViewById(collection.userId, collection.userMid)}>
                        {collection.userName}</span>
                </div>
            </div>

            {/* like count and play count */}
            <p className="text-silence entity-additional-info">
                {likeAndPlayCount}
            </p>

            <p className="text-silence entity-additional-info">
                {getDateYear(collection.releaseDate)} • {collection.songCount} tracks
            </p>
            <button className="btn btn-green cursor-pointer"
                onClick={() => handlePlayCollection(collection)}>PLAY</button>
        </div>
    );
}


class CollectionView extends React.Component<ICollectionViewProps, any> {

    constructor(props: ICollectionViewProps) {
        super(props);
    }

    componentDidMount() {
        // Scroll to document top
        window.scroll(0, 0);
    }

    render() {
        let collection = this.props.collection;
        let songsView = collection.songs.map(
            (song, index) => (
                <SongItemView
                    key={'collection_song_' + index.toString().padStart(3, '0')}
                    song={song}
                    active={false}
                    short={false}
                    thumb={false}
                    handlePlay={null} />
            )
        );

        return (
            <div className='hw-accelerate'>
                <div className='contentSpacing'>
                    <section className='content collection'>
                        <div className='container-fluid'>
                            <div className='row'>

                                <div className='col-xs-12 col-lg-3 col-xl-4 col-sticky'>
                                    <CollectionEntity collection={collection}
                                        handlePlayCollection={this.props.handlePlayCollection}
                                        showCollectionMenu={this.props.showCollectionMenu}
                                        handleShowUserProfileViewById={this.props.handleShowUserProfileViewById} />
                                </div>

                                <div className='col-xs-12 col-lg-9 col-xl-8 description'
                                    dangerouslySetInnerHTML={{ __html: collection.description }}>
                                </div>

                                <div className='col-xs-12 col-lg-9 col-xl-8'>
                                    <section className='tracklist-container'>
                                        <ol className='tracklist'>
                                            {songsView}
                                        </ol>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: IStateGlobal) {
    return {
        collection: state.mainView.collectionView.collection,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handlePlayCollection: collection => handlePlayCollection(collection).then(act => dispatch(act)),
        handleShowUserProfileViewById: (userId, userMid) => handleShowUserProfileViewById(userId, userMid).then(act => dispatch(act)),
        showCollectionMenu: (e, collection) => dispatch(showCollectionMenu(e, collection)),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(CollectionView);
