'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import Menu from 'chord/workbench/parts/menu/browser/component/menu';

import { handleAddLibraryRadio } from 'chord/workbench/parts/mainView/browser/action/addLibraryItem';


function RadioMenu({ item, view, top, left, handleAddLibraryItem }) {
    return view == 'radioMenuView' ?
        <Menu item={item} name='Radio' top={top} left={left} handleAddLibraryItem={handleAddLibraryItem} toQueue={false} /> : null;
}


function mapStateToProps(state: IStateGlobal) {
    let { radio, top, left } = state.menu.radioMenu;
    return {
        item: radio,
        top,
        left,
        view: state.menu.view,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handleAddLibraryItem: (radio) => dispatch(handleAddLibraryRadio(radio)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RadioMenu);
