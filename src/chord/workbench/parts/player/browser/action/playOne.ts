'use strict';

import { TPlayItem } from 'chord/unity/api/items';
import { IPlayOneAct } from 'chord/workbench/api/common/action/player';

import { addPlayItemAudios } from 'chord/workbench/api/utils/playItem';

import { noticePlayItem } from 'chord/workbench/parts/notification/action/notice';


export async function handlePlayOne(playItem: TPlayItem): Promise<IPlayOneAct> {
    await addPlayItemAudios(playItem);

    noticePlayItem(playItem);

    return {
        type: 'c:player:playOne',
        act: 'c:player:playOne',
        playItem: playItem,
    };
}
