'use strict';

import 'chord/css!../media/songInfo';

import * as React from 'react';
import { connect } from 'react-redux';

import { ISong } from 'chord/music/api/song';
import { ISongInfoProps } from 'chord/workbench/parts/player/browser/props/songInfo';
import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';


function Cover({ song, onclick }: { song: ISong, onclick: () => void }) {
    let defaultAvatar = '';
    let img = song ? (song.albumCoverPath || song.albumCoverUrl || defaultAvatar) : defaultAvatar;

    return (
        <span draggable={true}>
            <div className='player__cover-art'>
                <div className="cover-art"
                    style={{ width: '56px', height: '56px', background: 'none' }}
                    onClick={onclick}>
                    <div>
                        <div className="cover-art-image cover-art-image-loaded"
                            style={{ backgroundImage: `url("${img}")` }} ></div>
                    </div>
                </div>
            </div>
        </span >
    );
}

function Song({ song }) {
    return (
        <span>
            {song ? song.songName : ''}
        </span>
    );
}

function Artist({ song }) {
    return (
        <span>
            {song ? song.artistName : ''}
        </span>
    );
}


class SongInfo extends React.Component<ISongInfoProps, object> {
    constructor(props: ISongInfoProps) {
        super(props);
    }

    render() {
        return (
            <div className='track-info ellipsis-one-line'>
                <div className='track-info__name ellipsis-one-line'>
                    <Song song={this.props.song} />
                </div>
                <div className='track-info__artists ellipsis-one-line'>
                    <Artist song={this.props.song} />
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

function areStatePropsEqual(nextProps: ISongInfoProps, prevProps: ISongInfoProps) {
    if (!nextProps.song || !prevProps.song) {
        return false;
    }
    return nextProps.song.songId == prevProps.song.songId;
}

const options = {
    pure: true,
    areStatePropsEqual,
}


const componentCreator = connect(mapStateToProps, null, null, options);

const _Cover = componentCreator(Cover);
const _SongInfo = componentCreator(SongInfo);

export { _Cover as Cover, _SongInfo as SongInfo };
