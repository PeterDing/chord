'use strict';

import { ok } from 'chord/base/common/assert';


// TODO: change to full name
export enum ORIGIN {
    xiami = 'xiami',
    netease = 'netease',
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
}

export enum OriginAlbumUrl {
    xiami = 'https://www.xiami.com/album/{id}',
    netease = 'https://music.163.com/#/album?id={id}',
}

export enum OriginArtistUrl {
    xiami = 'https://www.xiami.com/artist/{id}',
    netease = 'https://music.163.com/#/artist?id={id}',
}

export enum OriginCollectionUrl {
    xiami = 'https://www.xiami.com/collect/{id}',
    netease = 'https://music.163.com/#/playlist?id={id}',
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
