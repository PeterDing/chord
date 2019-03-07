'use strict';

import * as React from 'react';


export interface INavMenuProps {
    namespace: string;
    thisView: string;
    views: Array<{ name: string; value: string; }>;
    handleClick: (view) => any;
}


export function NavMenu(props: INavMenuProps) {
    let items = props.views.map((view, index) => (
        <li className='search-nav-li'
            key={props.namespace + '_' + index.toString().padStart(3, '0')}>
            <div className={`search-nav-item link-subtle cursor-pointer ${props.thisView == view.value ? 'search-nav-item__active' : ''}`}
                onClick={() => props.handleClick(view.value)}>
                {view.name}
            </div>
        </li>
    ));
    return (
        <nav className='search-nav-container'>
            <ul className='search-nav-ul'>
                {items}
            </ul>
        </nav>
    );
}
