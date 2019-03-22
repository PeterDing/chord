'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { makeListKey } from 'chord/platform/utils/common/keys';

import { ViewMorePlusItem } from 'chord/workbench/parts/common/component/viewMoreItem';

import { IAlbum } from 'chord/music/api/album';
import { IOffset } from 'chord/workbench/api/common/state/offset';

import AlbumItemView from 'chord/workbench/parts/common/component/albumItem';

import { handleGetMoreAlbums } from 'chord/workbench/parts/mainView/browser/action/home/albums';


interface IAlbumListViewProps {
    origin: string;

    optionParams: string[];

    albums: Array<IAlbum>;
    albumsOffset: IOffset;

    handleGetMoreAlbums: (...args) => {};
}


class AlbumListView extends React.Component<IAlbumListViewProps, any> {

    constructor(props: IAlbumListViewProps) {
        super(props);

        this._getAlbumsView = this._getAlbumsView.bind(this);
    }

    _getAlbumsView(size?: number) {
        let albums = this.props.albums;
        let albumsView = albums.slice(0, size ? size : Infinity).map(
            (album, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={makeListKey(index, 'album', 'list')}>
                    <AlbumItemView album={album} />
                </div>
            )
        );
        return albumsView;
    }

    render() {
        let origin = this.props.origin;
        let offset = this.props.albumsOffset;
        let optionParams = this.props.optionParams;

        let albumsView = this._getAlbumsView();
        let viewMore = offset.more ? (
            <ViewMorePlusItem handler={(size) => this.props.handleGetMoreAlbums(origin, ...optionParams, offset, size)} />
        ) : null;

        return (
            <section className='artist-albums'>

                <div className='contentSpacing'>
                    { /* No Show */}
                    <h1 className='search-result-title' style={{ textAlign: 'center', display: 'none' }}>
                        Albums</h1>
                    <div className='container-fluid container-fluid--noSpaceAround'>
                        <div className='align-row-wrap grid--limit row'>
                            {albumsView}
                        </div>
                    </div>

                    {viewMore}

                </div>
            </section>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    let { origin, albums, albumsOffset } = state.mainView.homeView.albumsView;
    return { origin, albums, albumsOffset };
}

function mapDispatchToProps(dispatch) {
    return {
        handleGetMoreAlbums: (...args) => handleGetMoreAlbums(...args).then(act => dispatch(act)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumListView);
