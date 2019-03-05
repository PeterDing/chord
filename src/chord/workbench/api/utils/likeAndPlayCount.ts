'use strict';

import { literal_number } from 'chord/platform/utils/common/size';

import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';

export function getLikeAndPlayCount(item: IAlbum | IArtist | ICollection): string {
    let likeAndPlayCount = [
        item.likeCount ? literal_number(item.likeCount) + ' like' : null,
        item.playCount ? literal_number(item.playCount) + ' play' : null,
    ].filter(i => !!i).join(' • ');
    return likeAndPlayCount;
}
