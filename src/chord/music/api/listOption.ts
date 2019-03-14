'use strict';


export interface IOption {
    id: string;
    name: string;
}

export interface IListOption {
    name: string;
    type: string;
    items: Array<IOption>;
}
