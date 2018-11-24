'use strict';

import { audioSeek } from 'chord/workbench/parts/player/browser/reducer/audioSeek';
import { rewind, playPause, forward } from 'chord/workbench/parts/player/browser/reducer/control';
import { playAudio } from 'chord/workbench/parts/player/browser/reducer/playList';
import { playOne } from 'chord/workbench/parts/player/browser/reducer/playOne';
import { playMany } from 'chord/workbench/parts/player/browser/reducer/playMany';
import { playArtist } from 'chord/workbench/parts/player/browser/reducer/playArtist';
import { playAlbum } from 'chord/workbench/parts/player/browser/reducer/playAlbum';
import { playCollection } from 'chord/workbench/parts/player/browser/reducer/playCollection';
import { playUserFavoriteSongs } from 'chord/workbench/parts/player/browser/reducer/playUser';
import { changeVolume } from 'chord/workbench/parts/player/browser/reducer/volume';
import { addToQueue } from 'chord/workbench/parts/player/browser/reducer/addToQueue';
import { IReducerMap } from 'chord/workbench/api/common/reducer/reducerMap';


export function map(act: string): IReducerMap {
    switch (act) {
        case 'c:player:play':
            return {
                reducer: playAudio,
                node: '.',
            };
        case 'c:player:playOne':
            return {
                reducer: playOne,
                node: '.',
            };
        case 'c:player:playMany':
            return {
                reducer: playMany,
                node: '.',
            };
        case 'c:player:playArtist':
            return {
                reducer: playArtist,
                node: '.',
            };
        case 'c:player:playAlbum':
            return {
                reducer: playAlbum,
                node: '.',
            };
        case 'c:player:playCollection':
            return {
                reducer: playCollection,
                node: '.',
            };
        case 'c:player:playUserFavoriteSongs':
            return {
                reducer: playUserFavoriteSongs,
                node: '.',
            };
        case 'c:player:volume':
            return {
                reducer: changeVolume,
                node: '.',
            };
        case 'c:player:seek':
            return {
                reducer: audioSeek,
                node: '.'
            };
        case 'c:player:rewind':
            return {
                reducer: rewind,
                node: '.',
            };
        case 'c:player:playPause':
            return {
                reducer: playPause,
                node: '.',
            };
        case 'c:player:forward':
            return {
                reducer: forward,
                node: '.',
            };
        case 'c:player:addToQueue':
            return {
                reducer: addToQueue,
                node: '.',
            };
        default:
            return null;
    }
}
