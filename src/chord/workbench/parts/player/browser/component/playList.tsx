'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IPlayListProps } from 'chord/workbench/parts/player/browser/props/playList';
import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { handlePlay } from 'chord/workbench/parts/player/browser/action/playList';
import SongItemView from 'chord/workbench/parts/common/component/songItem';


export class PlayList extends React.Component<IPlayListProps, object> {

    playList: React.RefObject<HTMLDivElement>;
    show: boolean;

    constructor(props: IPlayListProps) {
        super(props);
        this.showPlayList = this.showPlayList.bind(this);

        this.playList = React.createRef();
        this.show = false;
    }

    showPlayList() {
        this.show = !this.show;
        this.playList.current.style.display = this.show ? 'block' : 'none';
    }


    render() {
        let index = this.props.index;
        let songItems = this.props.playList.map((song, i) => (
            <SongItemView
                key={i.toString()}
                handlePlay={() => this.props.handlePlay(i)}
                song={song}
                active={index == i}
                short={false} />
        ));

        return (
            <div className='player-list-container'>
                <button className='spoticon-queue-16 control-button'
                    onClick={this.showPlayList} aria-label='Queue'>
                </button>
                <div className='player-list-songs' ref={this.playList}>
                    {songItems}
                </div>
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    return {
        index: state.player.index,
        playList: state.player.playList,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handlePlay: (index: number) => dispatch(handlePlay(index)),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(PlayList);
