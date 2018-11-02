'use strict';

import { ISong } from 'chord/music/api/song';
import { IArtist } from 'chord/music/api/artist';
import { IAlbum } from 'chord/music/api/album';
import { ICollection } from 'chord/music/api/collection';
import { IUserProfile } from 'chord/music/api/user';

import { IAddToQueueAct } from 'chord/workbench/api/common/action/player';

import { handlePlayOne } from 'chord/workbench/parts/player/browser/action/playOne';
import { handlePlayArtist } from 'chord/workbench/parts/player/browser/action/playArtist';
import { handlePlayAlbum } from 'chord/workbench/parts/player/browser/action/playAlbum';
import { handlePlayCollection } from 'chord/workbench/parts/player/browser/action/playCollection';
import { handlePlayUserFavoriteSongs } from 'chord/workbench/parts/player/browser/action/playUser';


export async function handleAddToQueue(item: ISong | IArtist | IAlbum | ICollection | IUserProfile, direction: string): Promise<IAddToQueueAct> {
    let songs: Array<ISong>;
    switch (item.type) {
        case 'song':
            let act1 = await handlePlayOne(<ISong>item);
            songs = [act1.song];
            break;
        case 'artist':
            let act2 = await handlePlayArtist(<IArtist>item);
            songs = act2.artist.songs;
            break;
        case 'album':
            let act3 = await handlePlayAlbum(<IAlbum>item);
            songs = act3.album.songs;
            break;
        case 'collection':
            let act4 = await handlePlayCollection(<ICollection>item);
            songs = act4.collection.songs;
            break;
        case 'userProfile':
            let act5 = await handlePlayUserFavoriteSongs(<IUserProfile>item);
            songs = act5.songs;
            break;
        default:
            console.warn('`handleAddToQueue` act: unknown item\'s type: ' + JSON.stringify(item));
    }

    return {
        type: 'c:player:addToQueue',
        act: 'c:player:addToQueue',
        songs,
        direction,
    };
}
