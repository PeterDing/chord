'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { getUserProfileCount } from 'chord/workbench/api/utils/statistic';

import { ESize } from 'chord/music/common/size';

import { IUserProfileItemViewProps } from 'chord/workbench/parts/common/props/userProfileItem';

import { handleShowUserProfileView } from 'chord/workbench/parts/mainView/browser/action/showUserProfile';
import { handlePlayUserFavoriteSongs } from 'chord/workbench/parts/player/browser/action/playUser';

import { showUserProfileMenu } from 'chord/workbench/parts/menu/browser/action/menu';

import { Card } from 'chord/workbench/parts/common/abc/card';

import { UserProfileIcon } from 'chord/workbench/parts/common/component/common';
import { PlayIcon } from 'chord/workbench/parts/common/component/common';

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
        let userProfileCount = getUserProfileCount(userProfile);

        let name = (<span>{originIcon} {userProfile.userName}</span>);

        let infos = [
            { item: userProfileCount },
        ];

        return <Card
            name={name}
            cover={{ item: cover, act: () => this.props.handleShowUserProfileView(userProfile) }}
            defaultCover={UserProfileIcon}
            menu={(e) => this.props.showUserProfileMenu(e, userProfile)}
            button={{ item: PlayIcon, act: () => this.props.handlePlayUserFavoriteSongs(userProfile) }}
            infos={infos}
            shape={'circle'} />;
    }
}


function mapDispatchToProps(dispatch) {
    return {
        handleShowUserProfileView: userProfile => handleShowUserProfileView(userProfile).then(act => dispatch(act)),
        handlePlayUserFavoriteSongs: userProfile => handlePlayUserFavoriteSongs(userProfile).then(act => dispatch(act)),
        showUserProfileMenu: (e, userProfile) => dispatch(showUserProfileMenu(e, userProfile)),
    };
}

export default connect(null, mapDispatchToProps)(UserProfileItemView);
