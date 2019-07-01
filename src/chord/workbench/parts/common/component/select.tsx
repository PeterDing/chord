'use strict';

import * as React from 'react';


interface ISelectProps {
    namespace: string,
    options: Array<{ name: string, value: any, selected?: boolean }>;
    onchange: (event) => void;
}

export default function Select(props: ISelectProps) {
    let options = props.options.map((option, index) =>
        <option
            selected={!!option.selected}
            key={props.namespace + '_' + index.toString().padStart(3, '0')}
            value={option.value}>{option.name}</option>);
    return (
        <div className="select-control">
            <div className="select-container">
                <select onChange={(e) => props.onchange(e)}>{options}</select>
            </div>
        </div>
    );
}
