'use strict';

import { ORIGIN } from 'chord/music/common/origin';

import { ISong } from 'chord/music/api/song';
import { IUserProfile } from 'chord/music/api/user';

import { IPlayUserFavoriteSongsAct } from 'chord/workbench/api/common/action/player';

import { musicApi } from 'chord/music/core/api';

import { hasPlayItemAudio, addPlayItemAudiosIter } from 'chord/workbench/api/utils/playItem';
import { noticePlayItem } from 'chord/workbench/parts/notification/action/notice';


export async function handlePlayUserFavoriteSongs(userProfile: IUserProfile): Promise<IPlayUserFavoriteSongsAct> {
    let songs = userProfile.songs || [];
    let count = songs.length;

    if (songs.length < 100) {
        let _songs = await musicApi.userFavoriteSongs(userProfile.userId, 0, 100, userProfile.userMid);
        count = _songs.length;
        songs = _songs
            .filter(song => !song.disable)
            .filter(song => song.origin != ORIGIN.xiami || hasPlayItemAudio(song));
    }

    songs = (await addPlayItemAudiosIter(songs)) as Array<ISong>;

    noticePlayItem(userProfile, count, count - songs.length);

    return {
        type: 'c:player:playUserFavoriteSongs',
        act: 'c:player:playUserFavoriteSongs',
        songs,
    }
}
