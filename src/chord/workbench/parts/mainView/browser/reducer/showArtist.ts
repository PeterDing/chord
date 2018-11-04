'use strict';

import { equal } from 'chord/base/common/assert';

import { IShowArtistAct } from 'chord/workbench/api/common/action/mainView';

import { IArtistViewState } from 'chord/workbench/api/common/state/mainView/artistView';


export function showArtistView(state: IArtistViewState, act: IShowArtistAct): IArtistViewState {
    equal(act.act, 'c:mainView:showArtistView');

    return { 
        view: 'overview',
        artist: act.artist,
        songsOffset: act.songsOffset,
        albumsOffset: act.albumsOffset,
    };
}
