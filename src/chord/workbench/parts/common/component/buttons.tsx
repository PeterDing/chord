'use strict';

import * as React from 'react';


export function MenuButton({ click }) {
    return (
        <div className="react-contextmenu-wrapper"
            onClick={(e) => click(e)}>
            <button className="btn btn-transparent btn--narrow cursor-pointer" title="More">
                <div className="spoticon-ellipsis-24"></div>
            </button>
        </div>
    );
}


export function SmallButton(props: { title: string, click: (event) => void }) {
    return (
        <button className="btn btn-green btn-tiny btn--no-margin cursor-pointer"
            onClick={(e) => props.click(e)}>
            {props.title}
        </button>
    );
}


export function MiddleButton(props: { title: string, click: (event) => void }) {
    return (
        <button className="btn btn-green btn-small btn--no-margin cursor-pointer"
            onClick={(e) => props.click(e)}>
            {props.title}
        </button>
    );
}
