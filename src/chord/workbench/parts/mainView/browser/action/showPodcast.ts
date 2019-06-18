'use strict';

import { IShowPodcastAct } from 'chord/workbench/api/common/action/mainView';

import { IPodcast } from 'chord/sound/api/podcast';

import { soundApi } from 'chord/sound/core/api';


export async function handleShowPodcastView(podcast: IPodcast): Promise<IShowPodcastAct> {
    return {
        type: 'c:mainView:showPodcastView',
        act: 'c:mainView:showPodcastView',
        podcast,
    };
}


export async function handleShowPodcastViewById(podcastId: string): Promise<IShowPodcastAct> {
    let podcast = await soundApi.podcast(podcastId);
    return handleShowPodcastView(podcast);
}
