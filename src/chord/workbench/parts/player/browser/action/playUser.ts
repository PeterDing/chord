'use strict';

import { ORIGIN } from 'chord/music/common/origin';

import { IUserProfile } from 'chord/music/api/user';

import { IPlayUserFavoriteSongsAct } from 'chord/workbench/api/common/action/player';

import { musicApi } from 'chord/music/core/api';

import { hasSongAudio, addSongAudios, filterSongWithAudios } from 'chord/workbench/api/utils/song';


export async function handlePlayUserFavoriteSongs(userProfile: IUserProfile): Promise<IPlayUserFavoriteSongsAct> {
    let songs = filterSongWithAudios(userProfile.songs || []);

    if (songs.length < 100) {
        let _songs = await musicApi.userFavoriteSongs(userProfile.userId, 0, 100);
        songs = _songs
            .filter(song => !song.disable)
            .filter(song => song.origin != ORIGIN.xiami || hasSongAudio(song));
    }

    if (songs.length) {
        await addSongAudios(songs[0]);
    }

    return {
        type: 'c:player:playUserFavoriteSongs',
        act: 'c:player:playUserFavoriteSongs',
        songs,
    }
}
