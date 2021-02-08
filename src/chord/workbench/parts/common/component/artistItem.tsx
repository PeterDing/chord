'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { getLikeAndPlayCount } from 'chord/workbench/api/utils/statistic';

import { ESize } from 'chord/music/common/size';

import { IArtistItemViewProps } from 'chord/workbench/parts/common/props/artistItem';

import { handleShowArtistView } from 'chord/workbench/parts/mainView/browser/action/showArtist';
import { handlePlayArtist } from 'chord/workbench/parts/player/browser/action/playArtist';

import { showArtistMenu } from 'chord/workbench/parts/menu/browser/action/menu';

import { Card } from 'chord/workbench/parts/common/abc/card';

import { ArtistIcon } from 'chord/workbench/parts/common/component/common';
import { PlayIcon } from 'chord/workbench/parts/common/component/common';

import { OriginIcon } from 'chord/workbench/parts/common/component/originIcons';

import { musicApi } from 'chord/music/core/api';


class ArtistItemView extends React.Component<IArtistItemViewProps, object> {

    constructor(props: IArtistItemViewProps) {
        super(props);
    }

    render() {
        let artist = this.props.artist;
        let cover = artist.artistAvatarPath || musicApi.resizeImageUrl(artist.origin, artist.artistAvatarUrl, ESize.Large);
        let originIcon = OriginIcon(artist.origin, 'cover-icon xiami-icon');

        let likeAndPlayCount = getLikeAndPlayCount(artist);

        let name = (<span>{originIcon} {artist.artistName}</span>);

        let infos = [
            { item: likeAndPlayCount },
        ];

        return <Card
            name={name}
            cover={{ item: cover, act: () => this.props.handleShowArtistView(artist) }}
            defaultCover={ArtistIcon}
            menu={(e) => this.props.showArtistMenu(e, artist)}
            button={{ item: PlayIcon, act: () => this.props.handlePlayArtist(artist) }}
            infos={infos}
            shape={'circle'} />;
    }
}


function mapDispatchToProps(dispatch) {
    return {
        handleShowArtistView: artist => handleShowArtistView(artist).then(act => dispatch(act)),
        handlePlayArtist: artist => handlePlayArtist(artist).then(act => dispatch(act)),
        showArtistMenu: (e, artist) => dispatch(showArtistMenu(e, artist)),
    };
}


export default connect(null, mapDispatchToProps)(ArtistItemView);
