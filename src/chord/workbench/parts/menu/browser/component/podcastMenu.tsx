'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import Menu from 'chord/workbench/parts/menu/browser/component/menu';

import { handleAddLibraryPodcast } from 'chord/workbench/parts/mainView/browser/action/addLibraryItem';


function PodcastMenu({ item, view, top, left, handleAddLibraryItem }) {
    return view == 'podcastMenuView' ?
        <Menu item={item} name='Podcast' top={top} left={left} handleAddLibraryItem={handleAddLibraryItem} toQueue={true} /> : null;
}


function mapStateToProps(state: IStateGlobal) {
    let { podcast, top, left } = state.menu.podcastMenu;
    return {
        item: podcast,
        top,
        left,
        view: state.menu.view,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handleAddLibraryItem: (podcast) => dispatch(handleAddLibraryPodcast(podcast)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PodcastMenu);
