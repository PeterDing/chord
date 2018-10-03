'use strict';

import { ISong } from 'chord/music/api/song';
import { IArtist } from 'chord/music/api/artist';
import { IAlbum } from 'chord/music/api/album';
import { ICollection } from 'chord/music/api/collection';

import { IRemoveFromLibraryAct } from 'chord/workbench/api/common/action/mainView';

import { defaultUser } from 'chord/user/core/user';


export function handleRemoveFromLibrary(item: ISong | IArtist | IAlbum | ICollection): IRemoveFromLibraryAct {
    item.like = false;

    switch (item.type) {
        case 'song':
            defaultUser.deleteSong(<ISong>item);
            break;
        case 'artist':
            defaultUser.deleteArtist(<IArtist>item);
            break;
        case 'album':
            defaultUser.deleteAlbum(<IAlbum>item);
            break;
        case 'collection':
            defaultUser.deleteCollection(<ICollection>item);
            break;
        default:
            console.warn('`handleRemoveFromLibrary` act: unknown item\'s type: ' + JSON.stringify(item));
    }

    return {
        type: 'c:mainView:removeFromLibrary',
        act: 'c:mainView:removeFromLibrary',
        item,
    };
}
