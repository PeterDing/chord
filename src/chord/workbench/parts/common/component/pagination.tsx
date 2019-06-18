'use strict';

import * as React from 'react';

import { makeListKey } from 'chord/platform/utils/common/keys';


interface IPaginationViewProps {
    // total page number
    total: number;

    // current page
    // begin from 1
    page: number;

    // How many page buttons is to show
    size: number;

    handleClick: (page: number) => void;
}


interface IPaginationViewState {
    // current page
    page: number;

    // this pointer points to the middle of current view interval
    pointer: number;
}


export default class PaginationView extends React.Component<IPaginationViewProps, IPaginationViewState> {

    constructor(props: IPaginationViewProps) {
        super(props);

        this.state = {
            page: props.page,
            pointer: props.page,
        };
    }

    static getDerivedStateFromProps(nextProps: IPaginationViewProps, prevState: IPaginationViewState) {
        if (prevState.page != nextProps.page) {
            return { page: nextProps.page, pointer: nextProps.page };
        }
        return null;
    }

    movePointer(nextPointer: number) {
        this.setState({ pointer: nextPointer });
    }

    makePageButton(page: number, key: string) {
        let className = page == this.props.page ? 'pagination-link is-current' : 'pagination-link';
        return (
            <li key={key}
                onClick={() => this.props.handleClick(page)}>
                <span className={className}>{page}</span>
            </li>
        );

    }

    makeEllipsis(nextPointer: number, direction: string, key: string) {
        let symb = direction == 'left' ? '⬅' : '➡';
        return (
            <li key={key}
                onClick={() => this.movePointer(nextPointer)}>
                <span className='pagination-ellipsis cursor-pointer'>{symb}</span>
            </li>
        );
    }

    /**
     * size = 9, as following
     * 6 is the value of this.state.pointer
     *
     * 1  ... 3 4 5 6 7 8 9 ... 100
     */
    getPages() {
        let total = this.props.total;
        let size = this.props.size;
        if (total <= size) {
            return [...Array(total).keys()].map((index) => index + 1)
                .map(page => this.makePageButton(page, makeListKey(page, 'page')));
        }

        let pointer = this.state.pointer;
        pointer = pointer == 1 ? 2 : (pointer == total ? total - 1 : pointer);

        let half = (size - 3) / 2;
        let list = [pointer];
        let p = 0;

        let remains = size - 3;

        while (remains) {
            p += 1;

            if (remains && pointer - p > 1) {
                list = [pointer - p, ...list];
                remains -= 1;
            }
            if (remains && pointer + p < total) {
                list.push(pointer + p);
                remains -= 1;
            }
        }

        let pages = [];

        // add first page
        pages.push(this.makePageButton(1, makeListKey(1, 'page')));

        if (list[0] != 2) {
            pages.push(this.makeEllipsis(Math.max(0, pointer - half * 2), 'left', makeListKey(1, 'page-ellipsis')));
        }

        // add middle pages
        for (let i of list) {
            pages.push(this.makePageButton(i, makeListKey(i, 'page')));
        }

        if (list.slice(-1)[0] != total - 1) {
            pages.push(this.makeEllipsis(Math.min(pointer + half * 2, total), 'right', makeListKey(2, 'page-ellipsis')));
        }

        // add last page
        pages.push(this.makePageButton(total, makeListKey(total, 'page')));

        return pages;
    }

    render() {
        let { page, total } = this.props;
        if (total == 0) return null;

        let prePage = Math.max(0, page - 1);
        let nextPage = Math.min(total, page + 1);

        let pages = this.getPages();

        return (
            <div className='pagination-container'>

                <nav className='pagination is-rounded' role='navigation' aria-label='pagination'>

                    <span className='pagination-previous' onClick={() => this.props.handleClick(prePage)}>Previous</span>
                    <span className='pagination-next' onClick={() => this.props.handleClick(nextPage)}> Next page</span>

                    <ul className='pagination-list'>
                        {pages}
                    </ul>
                </nav>

            </div>
        );
    }
}
