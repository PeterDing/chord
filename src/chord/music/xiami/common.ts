'use strict';

import { IListOption } from 'chord/music/api/listOption';


export const ARTIST_LIST_OPTIONS: Array<IListOption> = [
    {
        'type': 'language',
        'name': '语言',
        'items': [
            { 'id': '0', 'name': '全部', },
            { 'id': '1', 'name': '华语', },
            { 'id': '4', 'name': '欧美', },
            { 'id': '2', 'name': '日本', },
            { 'id': '3', 'name': '韩国', },
            { 'id': '5', 'name': '音乐人', },
            { 'id': '6', 'name': '其他', }
        ]
    },
    {
        'type': 'tag',
        'name': '风格',
        'items': [
            { 'id': '0', 'name': '全部', },
            { 'id': '3', 'name': '摇滚', },
            { 'id': '2', 'name': '流行', },
            { 'id': '9', 'name': '电子', },
            { 'id': '16', 'name': '民谣', },
            { 'id': '5', 'name': '爵士', },
            { 'id': '21', 'name': '古典', },
            { 'id': '1', 'name': '说唱', },
            { 'id': '4', 'name': '布鲁斯', },
            { 'id': '12', 'name': '轻音乐', },
            { 'id': '19', 'name': '中国特色', },
            { 'id': '6', 'name': '雷鬼', },
            { 'id': '20', 'name': '乡村', },
            { 'id': '8', 'name': '拉丁', },
            { 'id': '15', 'name': '唱作人', }
        ],
    },
    {
        'type': 'gender',
        'name': '组合',
        'items': [
            { 'id': '0', 'name': '全部', },
            { 'id': '1', 'name': '男', },
            { 'id': '2', 'name': '女', },
            { 'id': '3', 'name': '组合', }
        ]
    },
    {
        type: 'index',
        name: '索引',
        items: [
            { id: null, name: '热门', },
            ...Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ#').map((c) => ({ id: c, name: c }))],
    },
];
