'use strict';

import { literal_number } from 'chord/platform/utils/common/size';

import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IUserProfile } from 'chord/music/api/user';

export function getLikeAndPlayCount(item: IAlbum | IArtist | ICollection): string {
    let likeAndPlayCount = [
        item.likeCount ? literal_number(item.likeCount) + ' like' : null,
        item.playCount ? literal_number(item.playCount) + ' play' : null,
    ].filter(i => !!i).join(' • ');
    return likeAndPlayCount;
}

/**
 * Get user's following, follower and favorite song count
 */
export function getUserProfileCount(item: IUserProfile): string {
    let userProfileCount = [
        item.followerCount ? literal_number(item.followerCount) + ' followers' : null,
        item.followingCount ? literal_number(item.followingCount) + ' following' : null,
        item.songCount? literal_number(item.songCount) + ' songs' : null,
    ].filter(i => !!i).join(' • ');
    return userProfileCount;
}
