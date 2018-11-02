'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { ESize } from 'chord/music/common/size';

import { IUserProfileItemViewProps } from 'chord/workbench/parts/common/props/userProfileItem';
import { UserProfileIcon } from 'chord/workbench/parts/common/component/common';

import { handleShowUserProfileView } from 'chord/workbench/parts/mainView/browser/action/showUserProfile';
import { handlePlayUserSongs } from 'chord/workbench/parts/player/browser/action/playUserProfile';

import { showUserProfileMenu } from 'chord/workbench/parts/menu/browser/action/menu';

import { OriginIcon } from 'chord/workbench/parts/common/component/originIcons';

import { musicApi } from 'chord/music/core/api';


class UserProfileItemView extends React.Component<IUserProfileItemViewProps, any> {

    constructor(props: IUserProfileItemViewProps) {
        super(props);
    }

    render() {
        let userProfile = this.props.userProfile;
        let cover = userProfile.userAvatarPath || musicApi.resizeImageUrl(userProfile.origin, userProfile.userAvatarUrl, ESize.Large);
        let originIcon = OriginIcon(userProfile.origin, 'cover-icon xiami-icon');

        return (
            <div>
                <div draggable={true}>
                    <div className="media-object mo-artist" style={{ maxWidth: '300px' }}>
                        <div className="media-object-hoverable">
                            <div className="react-contextmenu-wrapper"
                                onContextMenu={(e) => this.props.showUserProfileMenu(e, userProfile)}>

                                <div className="cover-art shadow actionable rounded linking cover-art--with-auto-height"
                                    aria-hidden="true" style={{ width: 'auto', height: 'auto' }}>
                                    <div onClick={() => this.props.handleShowUserProfileView(userProfile)}>
                                        {UserProfileIcon}
                                        <div className="cover-art-image cover-art-image-loaded"
                                            style={{ backgroundImage: `url("${cover}")` }}>
                                        </div>
                                    </div>
                                    <button className="cover-art-playback"
                                        onClick={() => this.props.handlePlayUserSongs(userProfile)}>
                                        <svg className="icon-play" viewBox="0 0 85 100"><path fill="currentColor" d="M81 44.6c5 3 5 7.8 0 10.8L9 98.7c-5 3-9 .7-9-5V6.3c0-5.7 4-8 9-5l72 43.3z"><title>PLAY</title></path></svg></button>
                                </div>

                            </div>

                            <div className="mo-info ellipsis-one-line">
                                <div className="react-contextmenu-wrapper">
                                    {/* Origin Icon */}
                                    {originIcon}

                                    {/* TODO: Add show userProfile handler */}
                                    <span className="mo-info-name">{userProfile.userName}</span>
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
        handleShowUserProfileView: userProfile => handleShowUserProfileView(userProfile).then(act => dispatch(act)),
        handlePlayUserSongs: userProfile => handlePlayUserSongs(userProfile).then(act => dispatch(act)),
        showUserProfileMenu: (e, userProfile) => dispatch(showUserProfileMenu(e, userProfile)),
    };
}

export default connect(null, mapDispatchToProps)(UserProfileItemView);
