'use strict';

import { Logger } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';
const logger = new Logger(filenameToNodeName(__filename));

import { ISong } from 'chord/music/api/song';
import { IArtist } from 'chord/music/api/artist';
import { IAlbum } from 'chord/music/api/album';
import { ICollection } from 'chord/music/api/collection';
import { IUserProfile } from 'chord/music/api/user';

import { IEpisode } from 'chord/sound/api/episode';
import { IPodcast } from 'chord/sound/api/podcast';
import { IRadio } from 'chord/sound/api/radio';

import { IRemoveFromLibraryAct } from 'chord/workbench/api/common/action/mainView';

import { defaultLibrary } from 'chord/library/core/library';

// TODO: check synchronal result
import { syncRemove } from 'chord/workbench/parts/mainView/browser/action/plugins/syncAddRemove';


export function handleRemoveFromLibrary(item: ISong | IArtist | IAlbum | ICollection | IUserProfile | IEpisode | IPodcast | IRadio): IRemoveFromLibraryAct {
    item.like = false;

    switch (item.type) {
        case 'song':
            defaultLibrary.deleteSong(<ISong>item);
            break;
        case 'artist':
            defaultLibrary.deleteArtist(<IArtist>item);
            break;
        case 'album':
            defaultLibrary.deleteAlbum(<IAlbum>item);
            break;
        case 'collection':
            defaultLibrary.deleteCollection(<ICollection>item);
            break;
        case 'userProfile':
            defaultLibrary.deleteUserProfile(<IUserProfile>item);
            break;

        case 'episode':
            defaultLibrary.deleteEpisode(<IEpisode>item);
            break;
        case 'podcast':
            defaultLibrary.deletePodcast(<IPodcast>item);
            break;
        case 'radio':
            defaultLibrary.deleteRadio(<IRadio>item);
            break;
        default:
            logger.error('`handleRemoveFromLibrary` act: unknown item\'s type:', item.type, item);
    }

    syncRemove(item);

    return {
        type: 'c:mainView:removeFromLibrary',
        act: 'c:mainView:removeFromLibrary',
        item,
    };
}
