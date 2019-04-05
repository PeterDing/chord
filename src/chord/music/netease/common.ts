'use strict';

import { IListOption } from 'chord/music/api/listOption';


export const ARTIST_LIST_OPTIONS: Array<IListOption> = [
    {
        type: 'category',
        name: '歌手',
        items: [
            { id: null, name: '热门歌手' },
            { id: '5001', name: '入驻歌手' },
            { id: '1001', name: '华语男歌手' },
            { id: '1002', name: '华语女歌手' },
            { id: '1003', name: '华语组合/乐队' },
            { id: '2001', name: '欧美男歌手' },
            { id: '2002', name: '欧美女歌手' },
            { id: '2003', name: '欧美组合/乐队' },
            { id: '6001', name: '日本男歌手' },
            { id: '6002', name: '日本女歌手' },
            { id: '6003', name: '日本组合/乐队' },
            { id: '7001', name: '韩国男歌手' },
            { id: '7002', name: '韩国女歌手' },
            { id: '7003', name: '韩国组合/乐队' },
            { id: '4001', name: '其他男歌手' },
            { id: '4002', name: '其他女歌手' },
            { id: '4003', name: '其他组合/乐队' },
        ],
    },
    {
        type: 'initial',
        name: '索引',
        items: [
            { id: '-1', name: '热门', },
            ...Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((c) =>
                ({ id: c.charCodeAt(0).toString(), name: c })),
            { id: '0', name: '其他', },
        ],
    },
];
