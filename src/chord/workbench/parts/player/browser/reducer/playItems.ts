'use strict';

import { TPlayItem } from 'chord/unity/api/items';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { CAudio } from 'chord/workbench/api/node/audio';

import { selectAudio } from 'chord/workbench/api/utils/playItem';

import { removeGlobelPlayPart } from 'chord/workbench/events/autoLoadNextPlayItems';


export function playItems(state: IPlayerState, playList: Array<TPlayItem>): IPlayerState {
    let index = 0;
    let playing = false;

    if (playList && playList.length) {
        let playItem = playList[0];
        // remove auto-load next playing items for song
        if (playItem.type == 'song') removeGlobelPlayPart();

        // TODO: read kbps configuration
        let audio = selectAudio(playItem.audios);
        let audioUrl = audio.path || audio.url;
        CAudio.makeAudio(audioUrl, (playItem as any).songId || (playItem as any).episodeId, playItem.duration);

        // play now
        CAudio.play();
        CAudio.volume(state.volume);
        playing = true;
        return { ...state, playList, index, playing, kbps: audio.kbps, id: Date.now() };
    }
    return { ...state };
}
