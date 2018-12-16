'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { ICollectionMenuProps } from 'chord/workbench/parts/menu/browser/props/collectionMenu';

import { handleAddLibraryCollection } from 'chord/workbench/parts/mainView/browser/action/addLibraryItem';
import { handleAddToQueue } from 'chord/workbench/parts/player/browser/action/addToQueue';
import { handleRemoveFromLibrary } from 'chord/workbench/parts/mainView/browser/action/removeFromLibrary';

import { defaultLibrary } from 'chord/library/core/library';


class CollectionMenu extends React.Component<ICollectionMenuProps, any> {

    menu: React.RefObject<HTMLDivElement>

    constructor(props: ICollectionMenuProps) {
        super(props);

        this.menu = React.createRef();
    }

    shouldComponentUpdate(nextProps: ICollectionMenuProps) {
        if (this.menu.current) { this.menu.current.style.display = 'block'; }
        return true;
    }

    render() {
        let collection = this.props.collection;
        if (!collection) {
            return null;
        }

        let top = this.props.top;
        let left = this.props.left;

        let like = defaultLibrary.exists(collection);
        collection.like = like;

        let addLibraryItem = collection && (!like ? (
            <div className="react-contextmenu-item cursor-pointer" role="menuitem" tabIndex={-1}
                onClick={() => this.props.handleAddLibraryCollection(collection)}>
                Save to your Favorite Collections</div>
        ) : null);

        let removeFromLibraryItem = collection && (like ? (
            <div className="react-contextmenu-item cursor-pointer" role="menuitem" tabIndex={-1}
                onClick={() => this.props.handleRemoveFromLibrary(collection)}>
                Remove from library</div>
        ) : null);

        return this.props.view == 'collectionMenuView' ? (
            <nav ref={this.menu} role="menu" tabIndex={-1} className="react-contextmenu"
                style={{ position: 'fixed', opacity: '1', pointerEvents: 'auto', top: `${top}px`, left: `${left}px` }}>

                {addLibraryItem}
                <div className="react-contextmenu-item cursor-pointer" role="menuitem" tabIndex={-1}
                    onClick={() => this.props.handleAddToQueue(collection, 'tail')}>
                    Add to Queue (After)</div>
                <div className="react-contextmenu-item cursor-pointer" role="menuitem" tabIndex={-1}
                    onClick={() => this.props.handleAddToQueue(collection, 'head')}>
                    Add to Queue (Before)</div>
                {/*<div className="react-contextmenu-item" role="menuitem" tabIndex={-1}>Add to Playlist</div>*/}
                {removeFromLibraryItem}

            </nav>
        ) : null;
    }
}


function mapStateToProps(state: IStateGlobal) {
    return {
        ...state.menu.collectionMenu,
        view: state.menu.view
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handleAddLibraryCollection: (collection) => dispatch(handleAddLibraryCollection(collection)),
        handleAddToQueue: (item, direction) => handleAddToQueue(item, direction).then(act => dispatch(act)),
        handleRemoveFromLibrary: (item) => dispatch(handleRemoveFromLibrary(item)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionMenu);
