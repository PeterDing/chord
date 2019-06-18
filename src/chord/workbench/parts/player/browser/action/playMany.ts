'use strict';

import { TPlayItem } from 'chord/unity/api/items';

import { IPlayManyAct } from 'chord/workbench/api/common/action/player';

import { addPlayItemAudiosIter } from 'chord/workbench/api/utils/playItem';

import { noticePlayItem } from 'chord/workbench/parts/notification/action/notice';


export async function handlePlayManyItems(playItems: Array<TPlayItem>): Promise<IPlayManyAct> {
    let count = playItems.length;
    playItems = await addPlayItemAudiosIter(playItems);

    let item = { type: 'list', listName: 'PlayList' };
    noticePlayItem(item, count, count - playItems.length);

    return {
        'type': 'c:player:playMany',
        'act': 'c:player:playMany',
        playItems,
    };
}
