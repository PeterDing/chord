'use strict';

import { equal } from 'chord/base/common/assert';

import { IShowAlbumAct } from 'chord/workbench/api/common/action/mainView';

import { IAlbumViewState } from 'chord/workbench/api/common/state/mainView/albumView';


export function showAlbumView(state: IAlbumViewState, act: IShowAlbumAct): IAlbumViewState {
    equal(act.act, 'c:mainView:showAlbumView');

    return { album: act.album };
}
