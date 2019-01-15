'use strict';

import 'chord/css!./media/playerView';

import * as React from 'react';

import ProcessBar from 'chord/workbench/parts/player/browser/component/processBar';
import { Cover, SongInfo } from 'chord/workbench/parts/player/browser/component/songInfo';
import LikeButton from 'chord/workbench/parts/player/browser/component/like';
import Controller from 'chord/workbench/parts/player/browser/component/controller';
import VolumeBar from 'chord/workbench/parts/player/browser/component/volume';
import { PlayListButtom, PlayListContent } from 'chord/workbench/parts/player/browser/component/playList';
import AudioInfo from 'chord/workbench/parts/player/browser/component/audioInfo';


export class PlayerView extends React.Component<any, any> {

    playListContentRef: React.RefObject<HTMLDivElement>;

    playerBarContainer: React.RefObject<HTMLDivElement>;
    playerBarCenter: React.RefObject<HTMLDivElement>;
    playerBarRight: React.RefObject<HTMLDivElement>;
    toggleState: boolean;


    constructor(props: any) {
        super(props);

        this.toggleController = this.toggleController.bind(this);

        this.playListContentRef = React.createRef();

        this.playerBarContainer = React.createRef();
        this.playerBarCenter = React.createRef();
        this.playerBarRight = React.createRef();
        this.toggleState = false;
    }

    toggleController() {
        let containerAnimation = `player-bar-controller-toggle-${this.toggleState ? 'off' : 'on'} 1s ease 0s 1 normal forwards`;

        this.playerBarContainer.current.style.animation = containerAnimation;
        this.playerBarCenter.current.style.display = this.toggleState ? 'block' : 'none';
        this.playerBarRight.current.style.display = this.toggleState ? 'flex' : 'none';

        this.toggleState = !this.toggleState;
    }

    render() {
        return (
            <div>
                <div ref={this.playListContentRef} className='playlist-content-container'>
                    <PlayListContent />
                </div>

                <div ref={this.playerBarContainer} className='playerBar-container'>
                    <footer className='player-bar-container'>
                        <div className='player-bar'>

                            <div className='player-bar__left'>
                                <div className='now-player'>
                                    <Cover onclick={() => this.toggleController()} song={null} />
                                    <SongInfo song={null} />
                                    <LikeButton />
                                </div>
                            </div>

                            <div ref={this.playerBarCenter} className='player-bar__center'>
                                <div className='player-controls'>
                                    <Controller />
                                    <ProcessBar />
                                </div>
                            </div>

                            <div ref={this.playerBarRight} className='player-bar__right'>
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
