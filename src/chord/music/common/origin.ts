'use strict';

import { ok } from 'chord/base/common/assert';


export enum ORIGIN {
    xiami = 'xiami',
    netease = 'netease',
    qq = 'qq',
    qianqian = 'qianqian',
    ximalaya = 'ximalaya',
    himalaya = 'himalaya',
    migu = 'migu',
    kuwo = 'kuwo',
}

export interface IOriginType {
    origin: string;

    // type: 'song', 'artist', 'album', 'collection'
    type: string;

    // original id
    id: string;
}

export function getOrigin(id: string): IOriginType {
    ok(Array.from(id).filter(c => c == '|').length == 2, `[ERROR] [getOrigin]: id is not a chord id, ${id}`);

    let chunk = id.split('|');
    let origin = ORIGIN[chunk[0]];
    let type = chunk[1];
    let originId = chunk[2];

    ok(origin, `[ERROR] [getOrigin]: unknown origin: ${origin}, id: ${id}`);

    return { origin, type, id: originId };
}

export enum OriginSongUrl {
    xiami = 'https://www.xiami.com/song/{id}',
    netease = 'https://music.163.com/#/song?id={id}',
    qq = 'https://y.qq.com/n/yqq/song/{id}.html',
    qianqian = 'http://music.taihe.com/song/{id}',
    migu = 'http://music.migu.cn/v3/music/song/{id}',
    kuwo = 'http://kuwo.cn/play_detail/{id}',
}

export enum OriginAlbumUrl {
    xiami = 'https://www.xiami.com/album/{id}',
    netease = 'https://music.163.com/#/album?id={id}',
    qq = 'https://y.qq.com/n/yqq/album/{id}.html',
    qianqian = 'http://music.taihe.com/album/{id}',
    migu = 'http://music.migu.cn/v3/music/album/{id}',
    kuwo = 'http://kuwo.cn/album_detail/{id}',
}

export enum OriginArtistUrl {
    xiami = 'https://www.xiami.com/artist/{id}',
    netease = 'https://music.163.com/#/artist?id={id}',
    qq = 'https://y.qq.com/n/yqq/singer/{id}.html',
    qianqian = 'http://music.taihe.com/artist/{id}',
    migu = 'http://music.migu.cn/v3/music/artist/{id}',
    kuwo = 'http://kuwo.cn/singer_detail/{id},'
}

export enum OriginCollectionUrl {
    xiami = 'https://www.xiami.com/collect/{id}',
    netease = 'https://music.163.com/#/playlist?id={id}',
    qq = 'https://y.qq.com/n/yqq/playsquare/{id}.html',
    qianqian = 'http://music.taihe.com/songlist/{id}',
    migu = 'http://music.migu.cn/v3/music/playlist/{id}',
    kuwo = 'http://kuwo.cn/playlist_detail/{id}',
}

export enum OriginUserUrl {
    xiami = 'https://www.xiami.com/u/{id}',
    netease = 'https://music.163.com/#/user/home?id={id}',
    qq = 'https://y.qq.com/portal/profile.html?uin={id}',

    // http://music.taihe.com/user?nickname=%E5%91%A8%E6%88%AA%E6%A3%8D%E7%9A%84%E5%8F%8C%E6%9D%B0%E4%BC%A6
    qianqian = 'http://music.taihe.com/user?nickname={id}',
    migu = 'http://music.migu.cn/v2/user/{id}',
}


export function getSongId(origin: string, id: string): string {
    return `${ORIGIN[origin]}|song|${id}`;
}

export function getAlbumId(origin: string, id: string): string {
    return `${ORIGIN[origin]}|album|${id}`;
}

export function getArtistId(origin: string, id: string): string {
    return `${ORIGIN[origin]}|artist|${id}`;
}

export function getCollectionId(origin: string, id: string): string {
    return `${ORIGIN[origin]}|collection|${id}`;
}

export function getUserId(origin: string, id: string): string {
    return `${ORIGIN[origin]}|user|${id}`;
}

export function getSongUrl(origin: string, id: string): string {
    return OriginSongUrl[origin].replace('{id}', id);
}

export function getAlbumUrl(origin: string, id: string): string {
    return OriginAlbumUrl[origin].replace('{id}', id);
}

export function getArtistUrl(origin: string, id: string): string {
    return OriginArtistUrl[origin].replace('{id}', id);
}

export function getCollectionUrl(origin: string, id: string): string {
    return OriginCollectionUrl[origin].replace('{id}', id);
}

export function getUserUrl(origin: string, id: string): string {
    return OriginUserUrl[origin].replace('{id}', id);
}
