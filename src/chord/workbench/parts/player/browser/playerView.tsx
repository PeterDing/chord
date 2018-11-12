'use strict';

import 'chord/css!./media/playerView';

import * as React from 'react';

import ProcessBar from 'chord/workbench/parts/player/browser/component/processBar';
import { Cover, SongInfo } from 'chord/workbench/parts/player/browser/component/songInfo';
import LikeButton from 'chord/workbench/parts/player/browser/component/like';
// import Like from 'chord/workbench/parts/player/browser/component/like';
import Controller from 'chord/workbench/parts/player/browser/component/controller';
import VolumeBar from 'chord/workbench/parts/player/browser/component/volume';
import { PlayListButtom, PlayListContent } from 'chord/workbench/parts/player/browser/component/playList';
import AudioInfo from 'chord/workbench/parts/player/browser/component/audioInfo';


export class PlayerView extends React.Component<any, any> {

    playListContentRef: React.RefObject<HTMLDivElement>;

    constructor(props: any) {
        super(props);
        this.playListContentRef = React.createRef();
    }

    render() {
        return (
            <div>
                <div ref={this.playListContentRef} className='playlist-content-container'>
                    <PlayListContent />
                </div>

                <div className='playerBar-container'>
                    <footer className='player-bar-container'>
                        <div className='player-bar'>

                            <div className='player-bar__left'>
                                <div className='now-player'>
                                    <Cover />
                                    <SongInfo />
                                    <LikeButton />
                                </div>
                            </div>

                            <div className='player-bar__center'>
                                <div className='player-controls'>
                                    <Controller />
                                    <ProcessBar />
                                </div>
                            </div>

                            <div className='player-bar__right'>
                                <div className='player-bar__right__inner'>
                                    <div className='extra-controls'>
                                        <AudioInfo />
                                        <PlayListButtom playListContent={this.playListContentRef} />
                                        <VolumeBar />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}
