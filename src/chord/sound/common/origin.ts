'use strict';

import {ORIGIN} from 'chord/music/common/origin';


export enum OriginEpisodeUrl {
    // ximalaya url at parser's code
    ximalaya = '',
}

export enum OriginPodcastUrl {
    // no podcast
    ximalaya = '',
}

export enum OriginRadioUrl {
    ximalaya = 'https://www.ximalaya.com/zhubo/{id}',
}


export function getEpisodeId(origin: string, id: string): string {
    return `${ORIGIN[origin]}|episode|${id}`;
}

export function getPodcastId(origin: string, id: string): string {
    return `${ORIGIN[origin]}|podcast|${id}`;
}

export function getRadioId(origin: string, id: string): string {
    return `${ORIGIN[origin]}|radio|${id}`;
}

export function getEpisodeUrl(origin: string, id: string): string {
    return OriginEpisodeUrl[origin].replace('{id}', id);
}

export function getPodcastUrl(origin: string, id: string): string {
    return OriginPodcastUrl[origin].replace('{id}', id);
}

export function getRadioUrl(origin: string, id: string): string {
    return OriginRadioUrl[origin].replace('{id}', id);
}
