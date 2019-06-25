'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { TPlayItem } from 'chord/unity/api/items';
import { ILikeButtonProps } from 'chord/workbench/parts/player/browser/props/like';
import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { handleAddLibrarySong, handleAddLibraryEpisode } from 'chord/workbench/parts/mainView/browser/action/addLibraryItem';
import { handleRemoveFromLibrary } from 'chord/workbench/parts/mainView/browser/action/removeFromLibrary';

import { defaultLibrary } from 'chord/library/core/library';


class LikeButton extends React.Component<ILikeButtonProps, any> {

    constructor(props: ILikeButtonProps) {
        super(props);
        this.handleLibraryActFunc = this.handleLibraryActFunc.bind(this);
    }

    handleLibraryActFunc(playItem: TPlayItem) {
        let handleLibraryActFunc = playItem.like ? this.props.handleRemoveFromLibrary
            : (playItem.type == 'song') ? this.props.handleAddLibrarySong : this.props.handleAddLibraryEpisode;
        playItem.like = !playItem.like;
        handleLibraryActFunc(playItem);
        this.forceUpdate();
    }

    render() {
        let playItem = this.props.playItem;
        if (!playItem) return null;

        let like = defaultLibrary.exists(playItem);
        playItem.like = like;

        let likeIconClass = like ? 'spoticon-heart-active-16' : 'spoticon-heart-16';

        return (
            <button className={`control-button ${likeIconClass} cursor-pointer`}
                onClick={() => this.handleLibraryActFunc(playItem)}></button>
        );
    }

}


function mapStateToProps(state: IStateGlobal) {
    return {
        playItem: state.player.playList.length ? state.player.playList[state.player.index] : null,
    };
}


function mapDispatchToProps(dispatch) {
    return {
        handleAddLibrarySong: (song) => dispatch(handleAddLibrarySong(song)),
        handleAddLibraryEpisode: (episode) => dispatch(handleAddLibraryEpisode(episode)),

        handleRemoveFromLibrary: (item) => dispatch(handleRemoveFromLibrary(item)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LikeButton);
