'use strict';


export interface IAppConfiguration {
    // How many items to be showed. (e.g. songs, artists ....)
    itemSize: number;

    // able origins
    origins: Array<string>;

    volumn: number;

    // This proxy is used for Chinese user
    proxy: string;

    // Max kbps
    maxKbps: number;
}


export function initiateAppConfiguration(): IAppConfiguration {
    return {
        itemSize: 10,
        origins: ['xiami', 'netease', 'qq', 'qianqian', 'ximalaya', 'himalaya'],
        volumn: 0.5,
        proxy: null,
        maxKbps: 6000,
    };
}
