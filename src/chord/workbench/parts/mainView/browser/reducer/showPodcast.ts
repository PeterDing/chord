'use strict';

import { equal } from 'chord/base/common/assert';

import { IShowPodcastAct } from 'chord/workbench/api/common/action/mainView';

import { IPodcastViewState } from 'chord/workbench/api/common/state/mainView/podcastView';


export function showPodcastView(state: IPodcastViewState, act: IShowPodcastAct): IPodcastViewState {
    equal(act.act, 'c:mainView:showPodcastView');

    return { podcast: act.podcast };
}
