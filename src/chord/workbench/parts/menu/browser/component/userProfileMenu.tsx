'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { IUserProfileMenuProps } from 'chord/workbench/parts/menu/browser/props/userProfileMenu';

import { handleAddLibraryUserProfile } from 'chord/workbench/parts/mainView/browser/action/addLibraryItem';
import { handleAddToQueue } from 'chord/workbench/parts/player/browser/action/addToQueue';
import { handleRemoveFromLibrary } from 'chord/workbench/parts/mainView/browser/action/removeFromLibrary';

import { defaultLibrary } from 'chord/library/core/library';


class UserProfileMenu extends React.Component<IUserProfileMenuProps, any> {

    menu: React.RefObject<HTMLDivElement>

    constructor(props: IUserProfileMenuProps) {
        super(props);

        this.menu = React.createRef();
    }

    shouldComponentUpdate(nextProps: IUserProfileMenuProps) {
        if (this.menu.current) { this.menu.current.style.display = 'block'; }
        return true;
    }

    render() {
        let userProfile = this.props.userProfile;
        if (!userProfile) {
            return null;
        }

        let top = this.props.top;
        let left = this.props.left;

        let like = defaultLibrary.exists(userProfile);
        userProfile.like = like;

        let addLibraryItem = userProfile && (!like ? (
            <div className="react-contextmenu-item" role="menuitem" tabIndex={-1}
                onClick={() => this.props.handleAddLibraryUserProfile(userProfile)}>
                Save to your Favorite UserProfiles</div>
        ) : null);

        let removeFromLibraryItem = userProfile && (like ? (
            <div className="react-contextmenu-item" role="menuitem" tabIndex={-1}
                onClick={() => this.props.handleRemoveFromLibrary(userProfile)}>
                Remove from library</div>
        ) : null);

        return this.props.view == 'userProfileMenuView' ? (
            <nav ref={this.menu} role="menu" tabIndex={-1} className="react-contextmenu"
                style={{ position: 'fixed', opacity: '1', pointerEvents: 'auto', top: `${top}px`, left: `${left}px` }}>

                {addLibraryItem}
                <div className="react-contextmenu-item" role="menuitem" tabIndex={-1}
                    onClick={() => this.props.handleAddToQueue(userProfile, 'tail')}>
                    Add to Queue (After)</div>
                <div className="react-contextmenu-item" role="menuitem" tabIndex={-1}
                    onClick={() => this.props.handleAddToQueue(userProfile, 'head')}>
                    Add to Queue (Before)</div>
                {/*<div className="react-contextmenu-item" role="menuitem" tabIndex={-1}>Add to Playlist</div>*/}
                {removeFromLibraryItem}

            </nav>
        ) : null;
    }
}


function mapStateToProps(state: IStateGlobal) {
    return {
        ...state.menu.userProfileMenu,
        view: state.menu.view
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handleAddLibraryUserProfile: (userProfile) => dispatch(handleAddLibraryUserProfile(userProfile)),
        handleAddToQueue: (item, direction) => handleAddToQueue(item, direction).then(act => dispatch(act)),
        handleRemoveFromLibrary: (item) => dispatch(handleRemoveFromLibrary(item)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileMenu);
