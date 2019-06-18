'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import Menu from 'chord/workbench/parts/menu/browser/component/menu';

import { handleAddLibraryUserProfile } from 'chord/workbench/parts/mainView/browser/action/addLibraryItem';


function UserProfileMenu({ item, view, top, left, handleAddLibraryItem }) {
    return view == 'userProfileMenuView' ?
        <Menu item={item} name='User' top={top} left={left} handleAddLibraryItem={handleAddLibraryItem} toQueue={true} /> : null;
}


function mapStateToProps(state: IStateGlobal) {
    let { userProfile, top, left } = state.menu.userProfileMenu;
    return {
        item: userProfile,
        top,
        left,
        view: state.menu.view,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handleAddLibraryItem: (userProfile) => dispatch(handleAddLibraryUserProfile(userProfile)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileMenu);
