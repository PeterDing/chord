'use strict';

import { literal_number } from 'chord/platform/utils/common/size';

import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IUserProfile } from 'chord/music/api/user';

import { IPodcast } from 'chord/sound/api/podcast';
import { IRadio } from 'chord/sound/api/radio';


export function getLikeAndPlayCount(item: IAlbum | IArtist | ICollection | IPodcast): string {
    let likeAndPlayCount = [
        item.likeCount ? literal_number(item.likeCount) + ' like' : null,
        item.playCount ? literal_number(item.playCount) + ' play' : null,
    ].filter(i => !!i).join(' • ');
    return likeAndPlayCount;
}


/**
 * Get user's following, follower and favorite song count
 */
export function getUserProfileCount(item: IUserProfile | IRadio): string {
    let trackCount;
    let trackType;
    switch (item.type) {
        case 'userProfile':
            trackCount = (item as IRadio).episodeCount;
            trackType = ' songs';
            break;
        case 'radio':
            trackCount = (item as IRadio).episodeCount;
            trackType = ' episodes';
            break;
        default:
            break;
    }
    let userProfileCount = [
        item.followerCount ? literal_number(item.followerCount) + ' followers' : null,
        item.followingCount ? literal_number(item.followingCount) + ' following' : null,
        trackCount ? literal_number(trackCount) + trackType : null,
    ].filter(i => !!i).join(' • ');
    return userProfileCount;
}
