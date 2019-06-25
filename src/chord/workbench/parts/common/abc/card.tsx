'use strict';

import * as React from 'react';

import { IClickItem } from 'chord/workbench/parts/common/abc/common';


interface ICardProps {
    name: any;

    cover: IClickItem;
    defaultCover: any;

    menu: (e) => void;

    button: IClickItem;

    infos: Array<IClickItem>;

    draggable: boolean;

    shape: string;
}


export class Card extends React.Component<ICardProps, any> {

    shape: string;

    constructor(props: ICardProps) {
        super(props);

    }

    render() {
        let infos = this.props.infos ? this.props.infos.map(
            (info, index) =>
                (
                    <div className='mo-meta' key={index}>
                        <div className='react-contextmenu-wrapper'>
                            <span className={info.act && 'link-subtle a-like cursor-pointer'}
                                onClick={() => { info.act && info.act(); }}>
                                {info.item}</span>
                        </div>
                    </div>
                )
        ) : null;

        // There is only two shape, reactangle and circle, default is rectangle
        let shape = this.props.shape == 'circle' ? 'rounded' : '';

        let button = this.props.button ?
            <button className='cover-art-playback cursor-pointer'
                onClick={() => this.props.button.act()}>
                {this.props.button.item}
            </button> : null;

        return (
            <div draggable={!!this.props.draggable}>
                <div className='media-object' style={{ maxWidth: '300px' }}>
                    <div className='media-object-hoverable'>
                        <div className='react-contextmenu-wrapper'
                            onContextMenu={(e) => this.props.menu(e)}>

                            <div className={'cover-art shadow actionable ' + shape + ' linking cursor-pointer cover-art--with-auto-height'} aria-hidden='true'
                                style={{ width: 'auto', height: 'auto' }}>
                                <div onClick={() => this.props.cover.act()}>
                                    {this.props.defaultCover}
                                    <div className='cover-art-image cover-art-image-loaded'
                                        style={{ backgroundImage: `url('${this.props.cover.item}')` }}>
                                    </div>
                                </div>
                                {button}
                            </div>

                        </div>

                        {/* Name */}
                        <div className='mo-info'>
                            <div className='react-contextmenu-wrapper'>
                                <span className='mo-info-name'>{this.props.name}</span>
                            </div>
                        </div>

                    </div>

                    {infos}
                </div>
            </div>
        );
    }
}
