'use strict';

import { TPlayItem } from 'chord/unity/api/items';
import { soundApi } from 'chord/sound/core/api';


interface IPlayPart<T> {
    type: string;
    params: T;
    actFunc: (params: T) => Promise<Array<TPlayItem>>;
    nextFunc: (params: T) => T;
    prevFunc: (params: T) => T;
}

class PlayPart<T>  {

    type: string;
    params: T;
    actFunc: (params: T) => Promise<Array<TPlayItem>>;
    nextFunc: (params: T) => T;
    prevFunc: (params: T) => T;

    constructor({ type, params, actFunc, nextFunc, prevFunc }: IPlayPart<T>) {
        this.type = type;
        this.params = params;
        this.actFunc = actFunc;
        this.nextFunc = nextFunc;
        this.prevFunc = prevFunc;

        this.nextPart = this.nextPart.bind(this);
        this.prevPart = this.prevPart.bind(this);
    }

    async nowPart(): Promise<Array<TPlayItem>> {
        let params = this.params;
        return this.actFunc(params);
    }

    async nextPart(): Promise<Array<TPlayItem>> {
        let params = this.nextFunc(this.params);
        this.params = params;
        return this.actFunc(params);
    }

    async prevPart(): Promise<Array<TPlayItem>> {
        let params = this.prevFunc(this.params);
        this.params = params;
        return this.actFunc(params);
    }
}



// For episodes of podcast
async function getPodcastEpisodes<T>(params: T): Promise<Array<TPlayItem>> {
    let { podcastId, params: p, offset, limit } = params as any;
    return soundApi.podcastEpisodes(podcastId, p, offset, limit);
}

function nextPodcastEpisodesParams<T>(params: T): T {
    (params as any).offset += 1;
    return params;
}

function prevPodcastEpisodesParams<T>(params: T): T {
    (params as any).offset -= 1;
    return params;
}

export function addGlobelPlayPartForPodcast<T>(params: T) {
    (window as any).playPart = new PlayPart({
        type: 'podcast',
        params,
        actFunc: getPodcastEpisodes,
        nextFunc: nextPodcastEpisodesParams,
        prevFunc: prevPodcastEpisodesParams,
    });
}


export function removeGlobelPlayPart() {
    (window as any).playPart = null;
}
