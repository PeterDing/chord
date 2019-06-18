'use strict';

import 'chord/css!../media/songInfo';

import * as React from 'react';
import { connect } from 'react-redux';

import { ESize } from 'chord/music/common/size';

import { ISong } from 'chord/music/api/song';
import { ISongInfoProps } from 'chord/workbench/parts/player/browser/props/songInfo';
import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { PlayItem } from 'chord/workbench/api/utils/playItem';


interface ICoverProps {
    song: ISong,
    onclick: () => void
}

class Cover extends React.Component<ICoverProps, any> {

    constructor(props: ICoverProps) {
        super(props);
    }

    render() {
        if (!this.props.song) return null;

        let item = new PlayItem(this.props.song);
        let cover = item.cover(ESize.Small);

        return (
            <span draggable={true}>
                <div className='player__cover-art'>
                    <div className="cover-art"
                        style={{ width: '56px', height: '56px', background: 'none' }}
                        onClick={this.props.onclick}>
                        <div>
                            <div className="cover-art-image cover-art-image-loaded"
                                style={{ backgroundImage: `url("${cover}")` }} ></div>
                        </div>
                    </div>
                </div>
            </span >
        );
    }
}


class SongInfo extends React.Component<ISongInfoProps, object> {
    constructor(props: ISongInfoProps) {
        super(props);
    }

    render() {
        if (!this.props.song) return null;

        let item = new PlayItem(this.props.song);
        let itemName = item.name(),
            ownerName = item.ownerName();

        return (
            <div className='track-info ellipsis-one-line'>
                <div className='track-info__name ellipsis-one-line'>
                    <span>{itemName}</span>
                </div>
                <div className='track-info__artists ellipsis-one-line'>
                    <span>{ownerName}</span>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    if (state.player.index == null) {
        return { song: null };
    }

    if (state.player.playList.length != 0) {
        let song = state.player.playList[state.player.index];
        return { song: song };
    } else {
        return { song: null };
    }
}

const componentCreator = connect(mapStateToProps);

const _Cover = componentCreator(Cover);
const _SongInfo = componentCreator(SongInfo);

export { _Cover as Cover, _SongInfo as SongInfo };
