'use strict';

import { IPodcast } from 'chord/sound/api/podcast';
import { TPlayItem } from 'chord/unity/api/items';

import { IPlayManyAct } from 'chord/workbench/api/common/action/player';

import { addPlayItemAudiosIter } from 'chord/workbench/api/utils/playItem';

import { noticePlayItem } from 'chord/workbench/parts/notification/action/notice';


export async function handlePlayPodcast(podcast: IPodcast, playItems: Array<TPlayItem>): Promise<IPlayManyAct> {
    let count = playItems.length;
    if (!count && (window as any).playPart) {
        playItems = await (window as any).playPart.nowPart();
        count = playItems.length;
    }

    playItems = await addPlayItemAudiosIter(playItems);

    noticePlayItem(podcast, count, count - playItems.length);

    return {
        'type': 'c:player:playMany',
        'act': 'c:player:playMany',
        playItems,
    };
}
