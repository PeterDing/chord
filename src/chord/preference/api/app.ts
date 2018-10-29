'use strict';


export interface IAppConfiguration {
    // How many items to be showed. (e.g. songs, artists ....)
    itemSize: number;

    // able origins
    origins: Array<string>;

    volumn: number;
}


export function initiateAppConfiguration(): IAppConfiguration {
    return {
        itemSize: 10,
        origins: ['xiami', 'netease', 'qq'],
        volumn: 0.5,
    };
}
