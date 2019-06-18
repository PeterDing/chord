'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { handleAddToQueue } from 'chord/workbench/parts/player/browser/action/addToQueue';
import { handleRemoveFromLibrary } from 'chord/workbench/parts/mainView/browser/action/removeFromLibrary';

import { defaultLibrary } from 'chord/library/core/library';


interface IMenuProps<T> {
    item: T;

    name: string;

    top: number;
    left: number;

    handleAddLibraryItem: (item) => void;
    handleAddToQueue: (item, direction) => void;
    handleRemoveFromLibrary: (item) => void;

    toQueue: boolean;
}

class Menu<T> extends React.Component<IMenuProps<T>, any> {

    menu: React.RefObject<HTMLDivElement>

    constructor(props: IMenuProps<T>) {
        super(props);

        this.menu = React.createRef();
    }

    shouldComponentUpdate(nextProps: IMenuProps<T>) {
        if (this.menu.current) { this.menu.current.style.display = 'block'; }
        return true;
    }

    render() {
        let item = this.props.item as any;
        if (!item) {
            return null;
        }

        let top = this.props.top;
        let left = this.props.left;

        let like = defaultLibrary.exists(item);
        item.like = like;

        let addLibraryItem = item && (!like ? (
            <div className="react-contextmenu-item cursor-pointer" role="menuitem" tabIndex={-1}
                onClick={() => this.props.handleAddLibraryItem(item)}>
                Save to your Favorite {this.props.name}</div>
        ) : null);

        let addToQueueTail = this.props.toQueue ?
            <div className="react-contextmenu-item cursor-pointer" role="menuitem" tabIndex={-1}
                onClick={() => this.props.handleAddToQueue(item, 'tail')}>
                Add to Queue (After)</div> : null;

        let addToQueueHead = this.props.toQueue ?
            <div className="react-contextmenu-item cursor-pointer" role="menuitem" tabIndex={-1}
                onClick={() => this.props.handleAddToQueue(item, 'head')}>
                Add to Queue (Before)</div> : null;

        let removeFromLibraryItem = item && (like ? (
            <div className="react-contextmenu-item cursor-pointer" role="menuitem" tabIndex={-1}
                onClick={() => this.props.handleRemoveFromLibrary(item)}>
                Remove from library</div>
        ) : null);

        return (
            <nav ref={this.menu} role="menu" tabIndex={-1} className="react-contextmenu"
                style={{ position: 'fixed', opacity: 1, pointerEvents: 'auto', top: `${top}px`, left: `${left}px` }}>

                {addLibraryItem}

                {addToQueueTail}
                {addToQueueHead}

                {/*<div className="react-contextmenu-item" role="menuitem" tabIndex={-1}>Add to Playlist</div>*/}
                {removeFromLibraryItem}

            </nav>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        handleAddToQueue: (item, direction) => handleAddToQueue(item, direction).then(act => dispatch(act)),
        handleRemoveFromLibrary: (item) => dispatch(handleRemoveFromLibrary(item)),
    };
}

export default connect(null, mapDispatchToProps)(Menu);
