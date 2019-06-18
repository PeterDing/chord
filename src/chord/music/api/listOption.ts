'use strict';


export interface IOption {
    id: string;
    name: string;
    info?: any;
}


export interface IListOption {
    id?: string;
    name: string;
    type: string;
    info?: any;
    items?: Array<IListOption | IOption>;
}
