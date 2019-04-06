'use strict';

import { equal } from 'chord/base/common/assert';

import { IHomeViewState } from 'chord/workbench/api/common/state/mainView/home/homeView';

import { IShowArtistListOptionsViewAct, IShowArtistListViewAct } from 'src/chord/workbench/api/common/action/home/artists';


export function showArtistListOptions(state: IHomeViewState, act: IShowArtistListOptionsViewAct): IHomeViewState {
    equal(act.act, 'c:mainView:home:showArtistListOptionsView');

    let artistsView = { ...state.artistsView, view: 'options' };
    return { ...state, view: 'artistsView', artistsView };
}


export function showArtistList(state: IHomeViewState, act: IShowArtistListViewAct): IHomeViewState {
    equal(act.act, 'c:mainView:home:showArtistListView');

    let artistsView = { ...state.artistsView, view: 'artists', origin: act.origin };
    return { ...state, view: 'artistsView', artistsView };
}
