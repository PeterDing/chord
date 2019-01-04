'use strict';


export interface IListOption {
    name: string;
    type: string;
    items: {
        [index: number]: {
            id: number | string;
            name: string;
        }
    };
}
