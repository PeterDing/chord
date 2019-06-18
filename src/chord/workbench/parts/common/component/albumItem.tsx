'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { getLikeAndPlayCount } from 'chord/workbench/api/utils/statistic';

import { ESize } from 'chord/music/common/size';

import { getDateYear } from 'chord/base/common/time';
import { IAlbumItemViewProps } from 'chord/workbench/parts/common/props/albumItem';
import { handlePlayAlbum } from 'chord/workbench/parts/player/browser/action/playAlbum';
import { handleShowAlbumView } from 'chord/workbench/parts/mainView/browser/action/showAlbum';
import { handleShowArtistViewById } from 'chord/workbench/parts/mainView/browser/action/showArtist';

import { showAlbumMenu } from 'chord/workbench/parts/menu/browser/action/menu';

import { Card } from 'chord/workbench/parts/common/abc/card';

import { AlbumIcon } from 'chord/workbench/parts/common/component/common';
import { PlayIcon } from 'chord/workbench/parts/common/component/common';

import { OriginIcon } from 'chord/workbench/parts/common/component/originIcons';

import { musicApi } from 'chord/music/core/api';


/**
 * Album item view
 *
 * This view doesn't display album's songs
 *
 * props.album is given by parent component
 */
class AlbumItemView extends React.Component<IAlbumItemViewProps, any> {

    constructor(props: IAlbumItemViewProps) {
        super(props);
    }

    render() {
        let album = this.props.album;
        let cover = album.albumCoverPath || musicApi.resizeImageUrl(album.origin, album.albumCoverUrl, ESize.Large);
        let originIcon = OriginIcon(album.origin, 'cover-icon xiami-icon');

        let likeAndPlayCount = getLikeAndPlayCount(album);

        let addons = (<span>{originIcon} {getDateYear(album.releaseDate)} • {album.songCount} tracks</span>);

        let infos = [
            { item: album.artistName, act: () => this.props.handleShowArtistViewById(album.artistId) },
            { item: likeAndPlayCount },
            { item: addons },
        ];

        return <Card
            name={album.albumName}
            cover={{ item: cover, act: () => this.props.handleShowAlbumView(album) }}
            defaultCover={AlbumIcon}
            menu={(e) => this.props.showAlbumMenu(e, album)}
            button={{ item: PlayIcon, act: () => this.props.handlePlayAlbum(album) }}
            infos={infos}
            draggable={true}
            shape={'rectangle'} />;
    }
}


function mapDispatchToProps(dispatch) {
    return {
        handlePlayAlbum: album => handlePlayAlbum(album).then(act => dispatch(act)),
        handleShowAlbumView: album => handleShowAlbumView(album).then(act => dispatch(act)),
        showAlbumMenu: (e, album) => dispatch(showAlbumMenu(e, album)),

        handleShowArtistViewById: artistId => handleShowArtistViewById(artistId).then(act => dispatch(act)),
    };
}


export default connect(null, mapDispatchToProps)(AlbumItemView);
