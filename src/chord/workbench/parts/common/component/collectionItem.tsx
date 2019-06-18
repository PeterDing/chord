'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { getLikeAndPlayCount } from 'chord/workbench/api/utils/statistic';

import { ESize } from 'chord/music/common/size';

import { getDateYear } from 'chord/base/common/time';
import { ICollectionItemViewProps } from 'chord/workbench/parts/common/props/collectionItem';
import { handlePlayCollection } from 'chord/workbench/parts/player/browser/action/playCollection';
import { handleShowCollectionView } from 'chord/workbench/parts/mainView/browser/action/showCollection';
import { handleShowUserProfileViewById } from 'chord/workbench/parts/mainView/browser/action/showUserProfile';

import { showCollectionMenu } from 'chord/workbench/parts/menu/browser/action/menu';

import { Card } from 'chord/workbench/parts/common/abc/card';

import { CollectionIcon } from 'chord/workbench/parts/common/component/common';
import { PlayIcon } from 'chord/workbench/parts/common/component/common';

import { OriginIcon } from 'chord/workbench/parts/common/component/originIcons';

import { musicApi } from 'chord/music/core/api';


/**
 * Collection item view
 *
 * This view doesn't display collection's songs
 *
 * props.collection is given by parent component
 */
class CollectionItemView extends React.Component<ICollectionItemViewProps, any> {

    constructor(props: ICollectionItemViewProps) {
        super(props);
    }

    render() {
        let collection = this.props.collection;
        let cover = collection.collectionCoverPath || musicApi.resizeImageUrl(collection.origin, collection.collectionCoverUrl, ESize.Large);
        let originIcon = OriginIcon(collection.origin, 'cover-icon xiami-icon');

        let likeAndPlayCount = getLikeAndPlayCount(collection);

        let addons = (<span>{originIcon} {getDateYear(collection.releaseDate)} • {collection.songCount} tracks</span>);

        let infos = [
            {
                item: collection.userName, act: () => this.props.handleShowUserProfileViewById(
                    collection.userId, collection.userMid, collection.userName)
            },
            { item: likeAndPlayCount },
            { item: addons },
        ];

        return <Card
            name={collection.collectionName}
            cover={{ item: cover, act: () => this.props.handleShowCollectionView(collection) }}
            defaultCover={CollectionIcon}
            menu={(e) => this.props.showCollectionMenu(e, collection)}
            button={{ item: PlayIcon, act: () => this.props.handlePlayCollection(collection) }}
            infos={infos}
            draggable={true}
            shape={'rectangle'} />;
    }
}


function mapDispatchToProps(dispatch) {
    return {
        handlePlayCollection: collection => handlePlayCollection(collection).then(act => dispatch(act)),
        handleShowCollectionView: collection => handleShowCollectionView(collection).then(act => dispatch(act)),
        showCollectionMenu: (e, collection) => dispatch(showCollectionMenu(e, collection)),

        handleShowUserProfileViewById: (userId, userMid, userName) => handleShowUserProfileViewById(userId, userMid, userName).then(act => dispatch(act)),
    };
}


export default connect(null, mapDispatchToProps)(CollectionItemView);
