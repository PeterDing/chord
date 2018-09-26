'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IArtistItemViewProps } from 'chord/workbench/parts/common/props/artistItem';
import { ArtistIcon } from 'chord/workbench/parts/common/component/common';

import { handleShowArtistView } from 'chord/workbench/parts/mainView/browser/action/showArtist';
import { handlePlayArtist } from 'chord/workbench/parts/player/browser/action/playArtist';

import { showArtistMenu } from 'chord/workbench/parts/menu/browser/action/menu';

import { OriginIcon } from 'chord/workbench/parts/common/component/originIcons';


class ArtistItemView extends React.Component<IArtistItemViewProps, object> {

    constructor(props: IArtistItemViewProps) {
        super(props);
    }

    render() {
        let artist = this.props.artist;
        let cover = artist.artistAvatarPath || artist.artistAvatarUrl;
        let originIcon = OriginIcon(artist.origin, 'cover-icon xiami-icon');

        return (
            <div>
                <div draggable={true}>
                    <div className="media-object mo-artist" style={{ maxWidth: '300px' }}>
                        <div className="media-object-hoverable">
                            <div className="react-contextmenu-wrapper"
                                onContextMenu={(e) => this.props.showArtistMenu(e, artist)}>

                                <div className="cover-art shadow actionable rounded linking cover-art--with-auto-height"
                                    aria-hidden="true" style={{ width: 'auto', height: 'auto' }}>
                                    <div onClick={() => this.props.handleShowArtistView(artist)}>
                                        {ArtistIcon}
                                        <div className="cover-art-image cover-art-image-loaded"
                                            style={{ backgroundImage: `url("${cover}")` }}>
                                        </div>
                                    </div>
                                    <button className="cover-art-playback"
                                        onClick={() => this.props.handlePlayArtist(artist)}>
                                        <svg className="icon-play" viewBox="0 0 85 100"><path fill="currentColor" d="M81 44.6c5 3 5 7.8 0 10.8L9 98.7c-5 3-9 .7-9-5V6.3c0-5.7 4-8 9-5l72 43.3z"><title>PLAY</title></path></svg></button>
                                </div>

                            </div>

                            <div className="mo-info ellipsis-one-line">
                                <div className="react-contextmenu-wrapper">
                                    {/* Origin Icon */}
                                    <span className="mo-info-name">{originIcon}</span>

                                    {/* TODO: Add show artist handler */}
                                    <span className="mo-info-name">{artist.artistName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
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
