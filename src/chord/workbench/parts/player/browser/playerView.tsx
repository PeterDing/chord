'use strict';

import 'chord/css!./media/playerView';

import * as React from 'react';

import ProcessBar from 'chord/workbench/parts/player/browser/component/processBar';
import { Cover, SongInfo } from 'chord/workbench/parts/player/browser/component/songInfo';
// import Like from 'chord/workbench/parts/player/browser/component/like';
import Controller from 'chord/workbench/parts/player/browser/component/controller';
import VolumeBar from 'chord/workbench/parts/player/browser/component/volume';
import PlayList from 'chord/workbench/parts/player/browser/component/playList';
import AudioInfo from 'chord/workbench/parts/player/browser/component/audioInfo';


export function PlayerView() {
    return (
        <div className='playerBar-container'>
            <footer className='player-bar-container'>
                <div className='player-bar'>

                    <div className='player-bar__left'>
                        <div className='now-player'>
                            <Cover />
                            <SongInfo />
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
                                <PlayList />
                                <VolumeBar />
                            </div>
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    );
}
