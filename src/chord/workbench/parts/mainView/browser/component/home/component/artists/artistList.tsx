'use strict';

import * as React from 'react';

import { makeListKey } from 'chord/platform/utils/common/keys';

import { ViewMoreItem } from 'chord/workbench/parts/common/component/viewMoreItem';

import { IArtist } from 'chord/music/api/artist';

import ArtistItemView from 'chord/workbench/parts/common/component/artistItem';


interface IArtistListViewProps {
    artists: Array<IArtist>;
    more: boolean;
    handleGetMoreArtists: () => any;
}


export default class ArtistListView extends React.Component<IArtistListViewProps, any> {

    constructor(props: IArtistListViewProps) {
        super(props);

        this._getArtistsView = this._getArtistsView.bind(this);
    }

    _getArtistsView(size?: number) {
        let artists = this.props.artists;
        let artistsView = artists.slice(0, size ? size : Infinity).map(
            (artist, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={makeListKey(index, 'artist', 'list')}>
                    <ArtistItemView artist={artist} />
                </div>
            )
        );
        return artistsView;
    }

    render() {
        let more = this.props.more;

        let artistsView = this._getArtistsView();
        let viewMore = more ? (<ViewMoreItem handler={() => this.props.handleGetMoreArtists()} />) : null;

        return (
            <section className='artist-artists'>

                <div className='contentSpacing'>
                    { /* No Show */}
                    <h1 className='search-result-title' style={{ textAlign: 'center', display: 'none' }}>
                        Artists</h1>
                    <div className='container-fluid container-fluid--noSpaceAround'>
                        <div className='align-row-wrap grid--limit row'>
                            {artistsView}
                        </div>
                    </div>

                    {viewMore}

                </div>
            </section>
        );
    }
}


// function mapStateToProps(state: IStateGlobal) {
    // let { artists } = state.mainView.homeView.artistsView;
    // return { artists };
// }

// function mapDispatchToProps(dispatch) {
// return {
// handleGetMoreArtists: (...args) => handleGetMoreArtists(...args).then(act => dispatch(act)),
// };
// }

// export default connect(mapStateToProps)(ArtistListView);
