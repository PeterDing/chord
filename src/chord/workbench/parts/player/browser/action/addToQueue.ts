'use strict';

import { Logger } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';
const logger = new Logger(filenameToNodeName(__filename));

import { ORIGIN } from 'chord/music/common/origin';

import { TPlayItem } from 'chord/unity/api/items';
import { ISong } from 'chord/music/api/song';
import { IArtist } from 'chord/music/api/artist';
import { IAlbum } from 'chord/music/api/album';
import { ICollection } from 'chord/music/api/collection';
import { IUserProfile } from 'chord/music/api/user';
import { TMusicItems } from 'chord/music/api/items';

import { IEpisode } from 'chord/sound/api/episode';
import { IPodcast } from 'chord/sound/api/podcast';

import { TSoundItems } from 'chord/sound/api/items';

import { IAddToQueueAct } from 'chord/workbench/api/common/action/player';

import { handlePlayOne } from 'chord/workbench/parts/player/browser/action/playOne';
import { handlePlayArtist } from 'chord/workbench/parts/player/browser/action/playArtist';
import { handlePlayAlbum } from 'chord/workbench/parts/player/browser/action/playAlbum';
import { handlePlayCollection } from 'chord/workbench/parts/player/browser/action/playCollection';
import { handlePlayUserFavoriteSongs } from 'chord/workbench/parts/player/browser/action/playUser';

import { handlePlayPodcast } from 'chord/workbench/parts/player/browser/action/playPodcast';

import { addGlobelPlayPartForPodcast } from 'chord/workbench/events/autoLoadNextPlayItems';


// import { hasSongAudio } from 'chord/workbench/api/utils/playItem';

import { OFFSETS } from 'chord/sound/common/params';


const PARAMS = {
    [ORIGIN.ximalaya]: {
        ...OFFSETS[ORIGIN.ximalaya],
        order: '0', // 正序
    },
};

function _addGlobelPlayPartForPodcast(origin: string, podcastId: string) {
    let { order, offset, limit } = PARAMS[origin];
    let params = {
        podcastId: podcastId,
        params: { order },
        offset,
        limit,
    }
    addGlobelPlayPartForPodcast(params);
}



export async function handleAddToQueue(item: TMusicItems | TSoundItems, direction: string): Promise<IAddToQueueAct> {
    let playItems: Array<TPlayItem>;
    switch (item.type) {
        case 'song':
            let act1 = await handlePlayOne(<ISong>item);
            playItems = [act1.playItem];
            break;
        case 'artist':
            let act2 = await handlePlayArtist(<IArtist>item);
            playItems = act2.artist.songs;
            break;
        case 'album':
            let act3 = await handlePlayAlbum(<IAlbum>item);
            playItems = act3.album.songs;
            break;
        case 'collection':
            let act4 = await handlePlayCollection(<ICollection>item);
            playItems = act4.collection.songs;
            break;
        case 'userProfile':
            let act5 = await handlePlayUserFavoriteSongs(<IUserProfile>item);
            playItems = act5.songs;
            break;

        case 'episode':
            let act6 = await handlePlayOne(<IEpisode>item);
            playItems = [act6.playItem];
            break;
        case 'podcast':
            let { origin, podcastId } = <IPodcast>item;
            _addGlobelPlayPartForPodcast(origin, podcastId);

            let act7 = await handlePlayPodcast(<IPodcast>item, []);
            playItems = act7.playItems;
            break;

        default:
            logger.warning('`handleAddToQueue` act: unknown item\'s type:', item);
    }

    // playItems = (playItems || []).filter(song => hasSongAudio(song));

    return {
        type: 'c:player:addToQueue',
        act: 'c:player:addToQueue',
        playItems,
        direction,
    };
}
