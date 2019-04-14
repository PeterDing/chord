'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { ISearchInputProps } from 'chord/workbench/parts/mainView/browser/component/search/props/searchInput';
import { search } from 'chord/workbench/parts/mainView/browser/action/searchInput';


class SearchInput extends React.Component<ISearchInputProps, any> {

    constructor(props: ISearchInputProps) {
        super(props);

        this.state = {
            keyword: this.props.keyword,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    /**
     * handle clicking of history searching
     */
    componentWillReceiveProps(nextProps: ISearchInputProps) {
        if (this.state.keyword != nextProps.keyword) {
            this.setState({
                keyword: nextProps.keyword,
            });
        }
    }

    handleInputChange(event) {
        this.setState({
            keyword: event.target.value,
        });
    }

    render() {
        return (
            <div className='inputBox'>
                <div className='contentSpacing'>
                    <h4 className='inputBox-label'>Search for an Artist, Song, Album, Playlist or Put some direct urls (e.g. xiami.com/song/1)</h4>
                    <form onSubmit={(event) => { this.props.search(this.state.keyword); event.preventDefault(); }}>
                        <input className='inputBox-input'
                            type="text" placeholder='Start typing...'
                            value={this.state.keyword} onChange={this.handleInputChange} />
                    </form>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    return {
        keyword: state.mainView.searchView.keyword,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        search: keyword => search(keyword).then(act => dispatch(act)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchInput);
