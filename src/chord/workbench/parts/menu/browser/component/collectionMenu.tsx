'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { ICollectionMenuProps } from 'chord/workbench/parts/menu/browser/props/collectionMenu';

import { handleAddLibraryCollection } from 'chord/workbench/parts/mainView/browser/action/addLibraryItem';


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
        let top = this.props.top;
        let left = this.props.left;

        return this.props.view == 'collectionMenuView' ? (
            <nav ref={this.menu} role="menu" tabIndex={-1} className="react-contextmenu"
                style={{ position: 'fixed', opacity: '1', pointerEvents: 'auto', top: `${top}px`, left: `${left}px` }}>

                <div className="react-contextmenu-item" role="menuitem" tabIndex={-1}
                    onClick={() => this.props.handleAddLibraryCollection(collection)}>
                    Save to your Favorite Collections</div>
                <div className="react-contextmenu-item" role="menuitem" tabIndex={-1}>Add to Queue</div>
                <div className="react-contextmenu-item" role="menuitem" tabIndex={-1}>Add to Playlist</div>

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
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionMenu);
