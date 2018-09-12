'use strict';

import { equal } from 'chord/base/common/assert';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { IPlayArtistAct } from 'chord/workbench/api/common/action/player';
import { CAudio } from 'chord/workbench/api/node/audio';


export function playArtist(state: IPlayerState, act: IPlayArtistAct): IPlayerState {
    equal(act.act, 'c:player:playArtist');

    // Filter songs these have not audios;
    let playList = act.artist.songs.filter(song => song.audios.length > 0);
    let index = 0;
    let playing = false;

    if (playList && playList.length) {
        for (let song of playList) {
            let audio = song.audios.filter(audio => audio.format == 'mp3')[0];
            let audioUrl = audio.path || audio.url;
            CAudio.makeAudio(audioUrl);

            // play now
            CAudio.play();
            CAudio.volume(state.volume);
            playing = true;
            break;
        }
    }
    return { ...state, playList, index, playing };
}
