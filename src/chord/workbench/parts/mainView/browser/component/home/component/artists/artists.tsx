'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { makeListKey } from 'chord/platform/utils/common/keys';

import { ORIGIN } from 'chord/music/common/origin';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import ArtistListOptionsView from 'chord/workbench/parts/mainView/browser/component/home/component/artists/artistListOptions';


interface IArtistsViewProps {
    view: string;
    origin: string;
}


class ArtistsView extends React.Component<IArtistsViewProps, any>{

    private xiamiArtistListOptionsView: JSX.Element;
    private neteaseArtistListOptionsView: JSX.Element;
    private qqArtistListOptionsView: JSX.Element;

    constructor(props: any) {
        super(props);

        this.xiamiArtistListOptionsView =
            <ArtistListOptionsView
                key={makeListKey(0, 'artist', 'options')}
                origin={ORIGIN.xiami}
                toShowArtistList={() => this.props.origin == ORIGIN.xiami} />;
        this.neteaseArtistListOptionsView =
            <ArtistListOptionsView
                key={makeListKey(1, 'artist', 'options')}
                origin={ORIGIN.netease}
                toShowArtistList={() => this.props.origin == ORIGIN.netease} />;
        this.qqArtistListOptionsView =
            <ArtistListOptionsView
                key={makeListKey(2, 'artist', 'options')}
                origin={ORIGIN.qq}
                toShowArtistList={() => this.props.origin == ORIGIN.qq} />;
    }

    render() {
        let View;

        switch (this.props.view) {
            case 'options':
                View = [
                    this.xiamiArtistListOptionsView,
                    this.neteaseArtistListOptionsView,
                    this.qqArtistListOptionsView
                ];
                break;
            case 'artists':
                switch (this.props.origin) {
                    case ORIGIN.xiami:
                        View = this.xiamiArtistListOptionsView;
                        break;
                    case ORIGIN.netease:
                        View = this.neteaseArtistListOptionsView;
                        break;
                    case ORIGIN.qq:
                        View = this.qqArtistListOptionsView;
                        break;
                    default:
                        throw new Error(`[ArtistsView]: unknown origin: ${origin}`);
                }
                break;
            default:
                throw new Error(`[ArtistsView]: unknown view: ${this.state.view}`);
        }
        return View;
    }
}


function mapStateToProps(state: IStateGlobal) {
    return {
        view: state.mainView.homeView.artistsView.view,
        origin: state.mainView.homeView.artistsView.origin,
    }
}

export default connect(mapStateToProps)(ArtistsView);
