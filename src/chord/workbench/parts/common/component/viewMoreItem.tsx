'use strict';

import * as React from 'react';


export function ViewMorePlusItem(props: { handler: (size) => any }) {
    return (
        <div className='row'>
            <div className="view-more row">
                <div className="btn btn-fg-green"
                    onClick={() => props.handler(10)}>
                    View More +10</div>

                <div className="btn btn-fg-green"
                    onClick={() => props.handler(20)}>
                    View More +20</div>

                <div className="btn btn-fg-green"
                    onClick={() => props.handler(50)}>
                    View More +50</div>

                <div className="btn btn-fg-green"
                    onClick={() => props.handler(100)}>
                    View More +100</div>

                <div className="btn btn-fg-green"
                    onClick={() => props.handler(500)}>
                    View More +500</div>

                <div className="btn btn-fg-green"
                    onClick={() => props.handler(1000)}>
                    View More +1000</div>
            </div>
        </div>
    );
}


export function ViewMoreItem(props: { handler: () => any }) {
    return (
        <div className='row'>
            <div className="view-more row">
                <div className="btn btn-fg-green"
                    onClick={props.handler}>
                    View More</div>
            </div>
        </div>
    );
}
