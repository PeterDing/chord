'use strict';

import * as React from 'react';

import { IClickItem } from 'chord/workbench/parts/common/abc/common';


interface IListProps {
    name: any;

    cover: string;

    menu: (e) => void;

    defaultButton: any;
    button: IClickItem;

    infos: Array<IClickItem>;

    leftInfos: Array<IClickItem>;

    active: boolean;
}


export class List extends React.Component<IListProps, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        let short = !this.props.infos;

        let liClassName = this.props.active ?
            (short ?
                'tracklist-row tracklist-row--oneline tracklist-row--active'
                : 'tracklist-row tracklist-row--active')
            : (short ? 'tracklist-row tracklist-row--oneline' : 'tracklist-row');

        let tracklistAlign = short ? 'tracklist-middle-align' : 'tracklist-top-align';

        let coverThumbView = this.props.cover ? (
            <div className='tracklist-col tracklist-col-cover-art-thumb'>
                <div className='cover-art shadow tracklist-middle-align cover-art--with-auto-height'
                    style={{ width: '50px', height: 'auto' }}>
                    <div>
                        <div className='cover-art-image cover-art-image-loaded'
                            style={{ backgroundImage: `url("${this.props.cover}")` }}>
                        </div>
                    </div>
                </div>
            </div>
        ) : null;


        let infos = [];
        if (!short) {
            for (let index = 0, key = 0; index < this.props.infos.length; index += 1) {
                let info = this.props.infos[index];
                if (index > 0) {
                    infos.push(
                        <span className="second-line-separator" aria-label="in album" key={key}>•</span>
                    );
                    key += 1;
                }
                infos.push(
                    <span className='react-contextmenu-wrapper' key={key}>
                        <span className='link-subtle a-like cursor-pointer' tabIndex={-1}
                            onClick={() => info.act()}>
                            {info.item}</span>
                    </span>
                );
                key += 1;
            }
        }
        let infosView = short ? null : (
            <span className='second-line ellipsis-one-line'>
                {infos}
            </span>
        );

        let leftInfos = this.props.leftInfos ?
            this.props.leftInfos.map((info, index) => (
                <div className='tracklist-col tracklist-col-duration' key={index}>
                    <div className={`tracklist-duration ${tracklistAlign}`}>
                        <span>{info.item}</span>
                    </div>
                </div>
            )) : null;

        return (
            <div className='react-contextmenu-wrapper'>
                <div id={this.props.active ? 'playing-this' : undefined}
                    onContextMenu={(e) => this.props.menu(e)}>
                    <li className={liClassName} role='button' tabIndex={0}>

                        {/* music icon */}
                        <div className='tracklist-col position-outer cursor-pointer'
                            onClick={() => this.props.button.act()}>
                            <div className={`tracklist-play-pause ${tracklistAlign}`}>
                                {/* Play icon */}
                                {this.props.button.item}
                            </div>
                            <div className={`position ${tracklistAlign}`}>
                                {/* Music icon or sound icon */}
                                {this.props.defaultButton}
                            </div>
                        </div>

                        {/* cover */}
                        {coverThumbView}

                        <div className='tracklist-col name'>
                            <div className={`track-name-wrapper ellipsis-one-line ${tracklistAlign}`}>

                                {/* Song Name */}
                                <span className='tracklist-name'>
                                    {this.props.name}
                                </span>

                                {infosView}
                            </div>
                        </div>

                        {leftInfos}
                    </li>
                </div>
            </div>
        );
    }
}
