'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { makeListKey } from 'chord/platform/utils/common/keys';

import { ORIGIN } from 'chord/music/common/origin';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import AlbumListOptionsView from 'chord/workbench/parts/mainView/browser/component/home/component/albums/albumListOptions';


function AlbumsView({ view, origin }: { view: string, origin: ORIGIN }) {
    let View;

    // Reuse following views
    let xiamiAlbumListOptionsView =
        <AlbumListOptionsView key={makeListKey(0, 'album', 'options')} origin={ORIGIN.xiami} />;
    let qqAlbumListOptionsView =
        <AlbumListOptionsView key={makeListKey(1, 'album', 'options')} origin={ORIGIN.qq} />;

    switch (view) {
        case 'options':
            View = [xiamiAlbumListOptionsView, qqAlbumListOptionsView];
            break;
        case 'albums':
            switch (origin) {
                case ORIGIN.xiami:
                    View = xiamiAlbumListOptionsView;
                    break;
                case ORIGIN.qq:
                    View = qqAlbumListOptionsView;
                    break;
                default:
                    throw new Error(`[AlbumsView]: unknown origin: ${origin}`);
            }
            break;
        default:
            throw new Error(`[AlbumsView]: unknown view: ${view}`);
    }

    return View;
}


function mapStateToProps(state: IStateGlobal) {
    return {
        view: state.mainView.homeView.albumsView.view,
        origin: state.mainView.homeView.albumsView.origin,
    }
}

export default connect(mapStateToProps)(AlbumsView);
