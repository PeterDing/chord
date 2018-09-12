'use strict';


export enum ORIGIN {
    xiami = 'xm',
    netease = 'ne',
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
    return `${ORIGIN[origin]}|s|${id}`;
}

export function getAlbumId(origin: string, id: string): string {
    return `${ORIGIN[origin]}|a|${id}`;
}

export function getArtistId(origin: string, id: string): string {
    return `${ORIGIN[origin]}|t|${id}`;
}

export function getCollectionId(origin: string, id: string): string {
    return `${ORIGIN[origin]}|c|${id}`;
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
