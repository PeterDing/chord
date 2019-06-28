'use strict';

import { getOrigin, ORIGIN } from 'chord/music/common/origin';

import { md5 } from 'chord/base/node/crypto';

import { IListOption } from 'chord/music/api/listOption';

import { IAudio } from 'chord/music/api/audio';
import { IEpisode } from 'chord/sound/api/episode';
import { IPodcast } from 'chord/sound/api/podcast';
import { IRadio } from 'chord/sound/api/radio';
import { TSoundItems } from 'chord/sound/api/items';

import { ESize } from 'chord/music/common/size';

import { cache12, cache30 } from 'chord/base/common/lru';

import { makeItem, makeItems } from 'chord/music/core/parser';

import { insertMerge } from 'chord/base/common/algorithms';

import { XimalayaApi } from 'chord/sound/ximalaya/api';
import { HimalayaApi } from 'chord/sound/himalaya/api';


export class Sound {

    ximalayaApi: XimalayaApi;
    himalayaApi: HimalayaApi;


    constructor() {
        let ximalayaApi = new XimalayaApi();
        this.ximalayaApi = ximalayaApi;

        let himalayaApi = new HimalayaApi();
        this.himalayaApi = himalayaApi;
    }


    public clean(origin: string): void {
        switch (origin) {
            case ORIGIN.ximalaya:
                this.ximalayaApi = new XimalayaApi();
                break;
            case ORIGIN.himalaya:
                this.himalayaApi = new HimalayaApi();
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.clean] Here will never be occured. [args]: ${origin}`);
        }
    }


    public async audios(episodeId: string): Promise<Array<IAudio>> {
        let h = md5(`sound.core.api.audios(${episodeId})`);
        let result = cache30.get(h);
        if (result) return result;

        let originType = getOrigin(episodeId);
        switch (originType.origin) {
            case ORIGIN.ximalaya:
                result = await this.ximalayaApi.audios(originType.id);
                break;
            case ORIGIN.himalaya:
                result = await this.himalayaApi.audios(originType.id);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.audio] Here will never be occured. [args]: ${episodeId}`);
        }

        cache30.set(h, result);
        return result;
    }


    public async episode(episodeId: string): Promise<IEpisode> {
        let h = md5(`sound.core.api.episode(${episodeId})`);
        let result = cache12.get(h);
        result = makeItem(result);
        if (result) return result;

        let item;
        let originType = getOrigin(episodeId);
        switch (originType.origin) {
            case ORIGIN.ximalaya:
                item = await this.ximalayaApi.episode(originType.id);
                break;
            case ORIGIN.himalaya:
                item = await this.himalayaApi.episode(originType.id);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.episode] Here will never be occured. [args]: ${episodeId}`);
        }
        result = makeItem(item);

        cache12.set(h, result);
        return result;
    }


    public async podcast(podcastId: string): Promise<IPodcast> {
        let h = md5(`sound.core.api.podcast(${podcastId})`);
        let result = cache12.get(h);
        result = makeItem(result);
        if (result) return result;

        let item;
        let originType = getOrigin(podcastId);
        switch (originType.origin) {
            case ORIGIN.ximalaya:
                item = await this.ximalayaApi.podcast(originType.id);
                break;
            case ORIGIN.himalaya:
                item = await this.himalayaApi.podcast(originType.id);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.podcast] Here will never be occured. [args]: ${podcastId}`);
        }
        result = makeItem(item);

        cache12.set(h, result);
        return result;
    }


    public async podcastEpisodeCount(podcastId: string): Promise<number> {
        let h = md5(`sound.core.api.podcastEpisodeCount(${podcastId})`);
        let result = cache12.get(h);
        if (result) return result;

        let item;
        let originType = getOrigin(podcastId);
        switch (originType.origin) {
            case ORIGIN.ximalaya:
                item = await this.ximalayaApi.podcastEpisodeCount(originType.id);
                break;
            case ORIGIN.himalaya:
                item = await this.himalayaApi.podcastEpisodeCount(originType.id);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.podcastPages] Here will never be occured. [args]: ${podcastId}`);
        }
        result = item;

        cache12.set(h, result);
        return result;
    }


    public async podcastEpisodes(podcastId: string, params?: any, offset: number = 0, limit: number = 10): Promise<Array<IEpisode>> {
        let h = md5(`sound.core.api.podcastEpisodes(${podcastId}, ${JSON.stringify(params)}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let item;
        let originType = getOrigin(podcastId);
        switch (originType.origin) {
            case ORIGIN.ximalaya:
                item = await this.ximalayaApi.podcastEpisodes(originType.id, offset + 1, params.order || '1');
                break;
            case ORIGIN.himalaya:
                item = await this.himalayaApi.podcastEpisodes(originType.id, offset + 1, limit, params.order || '1');
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.podcastEpisodes] Here will never be occured. [args]: ${podcastId}, ${JSON.stringify(params)}, ${offset}, ${limit}`);
        }
        result = makeItems(item);

        cache12.set(h, result);
        return result;
    }


    public async radio(radioId: string): Promise<IRadio> {
        let h = md5(`sound.core.api.radio(${radioId})`);
        let result = cache12.get(h);
        result = makeItem(result);
        if (result) return result;

        let item;
        let originType = getOrigin(radioId);
        switch (originType.origin) {
            case ORIGIN.ximalaya:
                item = await this.ximalayaApi.radio(originType.id);
                break;
            case ORIGIN.himalaya:
                return null;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.radio] Here will never be occured. [args]: ${radioId}`);
        }
        result = makeItem(item);

        cache12.set(h, result);
        return result;
    }

    public async radioEpisodeCount(radioId: string, params?: any): Promise<number> {
        let h = md5(`sound.core.api.radioEpisodeCount(${radioId}, ${JSON.stringify(params)})`);
        let result = cache12.get(h);
        if (result) return result;

        let item;
        let originType = getOrigin(radioId);
        switch (originType.origin) {
            case ORIGIN.ximalaya:
                item = await this.ximalayaApi.radioEpisodeCount(originType.id, params.keyword || '');
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.radioEpisodeCount] Here will never be occured. [args]: ${radioId}, ${JSON.stringify(params)}`);
        }
        result = item;

        cache12.set(h, result);
        return result;
    }


    public async radioEpisodes(radioId: string, params?: any, offset: number = 0, limit: number = 10): Promise<Array<IEpisode>> {
        let h = md5(`sound.core.api.radioEpisodes(${radioId}, ${JSON.stringify(params)}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let items;
        let originType = getOrigin(radioId);
        switch (originType.origin) {
            case ORIGIN.ximalaya:
                items = await this.ximalayaApi.radioEpisodes(originType.id, offset + 1, limit, params.order, params.keyword);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.radioEpisodes] Here will never be occured. [args]: ${radioId}, ${JSON.stringify(params)}, ${offset}, ${limit}`);
        }
        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public async radioFavoritePodcastCount(radioId: string, params?: any): Promise<number> {
        let h = md5(`sound.core.api.radioFavoritePodcastCount(${radioId}, ${JSON.stringify(params)})`);
        let result = cache12.get(h);
        if (result) return result;

        let item;
        let originType = getOrigin(radioId);
        switch (originType.origin) {
            case ORIGIN.ximalaya:
                item = await this.ximalayaApi.radioFavoritePodcastCount(originType.id, params.keyword);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.radioFavoritePodcastCount] Here will never be occured. [args]: ${radioId}, ${JSON.stringify(params)}`);
        }
        result = item;

        cache12.set(h, result);
        return result;
    }


    public async radioFavoritePodcasts(radioId: string, params?: any, offset: number = 0, limit: number = 10): Promise<Array<IPodcast>> {
        let h = md5(`sound.core.api.radioFavoritePodcasts(${radioId}, ${JSON.stringify(params)}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let items;
        let originType = getOrigin(radioId);
        switch (originType.origin) {
            case ORIGIN.ximalaya:
                items = await this.ximalayaApi.radioFavoritePodcasts(originType.id, offset + 1, limit, params.order, params.keyword);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.radioFavoritePodcasts] Here will never be occured. [args]: ${radioId}, ${JSON.stringify(params)}, ${offset}, ${limit}`);
        }
        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public async radioPodcastCount(radioId: string, params?: any): Promise<number> {
        let h = md5(`sound.core.api.radioPodcastCount(${radioId}, ${JSON.stringify(params)})`);
        let result = cache12.get(h);
        if (result) return result;

        let item;
        let originType = getOrigin(radioId);
        switch (originType.origin) {
            case ORIGIN.ximalaya:
                item = await this.ximalayaApi.radioPodcastCount(originType.id, params.keyword);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.radioPodcastCount] Here will never be occured. [args]: ${radioId}, ${JSON.stringify(params)}`);
        }
        result = item;

        cache12.set(h, result);
        return result;
    }


    public async radioPodcasts(radioId: string, params?: any, offset: number = 0, limit: number = 10): Promise<Array<IPodcast>> {
        let h = md5(`sound.core.api.radioPodcasts(${radioId}, ${JSON.stringify(params)}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let items;
        let originType = getOrigin(radioId);
        switch (originType.origin) {
            case ORIGIN.ximalaya:
                items = await this.ximalayaApi.radioPodcasts(originType.id, offset + 1, limit, params.order, params.keyword);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.radioPodcasts] Here will never be occured. [args]: ${radioId}, ${JSON.stringify(params)}, ${offset}, ${limit}`);
        }
        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public async radioFollowerCount(radioId: string): Promise<number> {
        let h = md5(`sound.core.api.radioFollowerCount(${radioId})`);
        let result = cache12.get(h);
        if (result) return result;

        let item;
        let originType = getOrigin(radioId);
        switch (originType.origin) {
            case ORIGIN.ximalaya:
                item = await this.ximalayaApi.radioFollowerCount(originType.id);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.radioFollowerCount] Here will never be occured. [args]: ${radioId}`);
        }
        result = item;

        cache12.set(h, result);
        return result;
    }


    public async radioFollowers(radioId: string, offset: number = 0, limit: number = 10): Promise<Array<IRadio>> {
        let h = md5(`sound.core.api.radioFollowers(${radioId}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let items;
        let originType = getOrigin(radioId);
        switch (originType.origin) {
            case ORIGIN.ximalaya:
                items = await this.ximalayaApi.radioFollowers(originType.id, offset + 1, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.radioFollowers] Here will never be occured. [args]: ${radioId}, ${offset}, ${limit}`);
        }
        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public async radioFollowingCount(radioId: string): Promise<number> {
        let h = md5(`sound.core.api.radioFollowingCount(${radioId})`);
        let result = cache12.get(h);
        if (result) return result;

        let item;
        let originType = getOrigin(radioId);
        switch (originType.origin) {
            case ORIGIN.ximalaya:
                item = await this.ximalayaApi.radioFollowingCount(originType.id);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.radioFollowingCount] Here will never be occured. [args]: ${radioId}`);
        }
        result = item;

        cache12.set(h, result);
        return result;
    }


    public async radioFollowings(radioId: string, offset: number = 0, limit: number = 10): Promise<Array<IRadio>> {
        let h = md5(`sound.core.api.radioFollowings(${radioId}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let items;
        let originType = getOrigin(radioId);
        switch (originType.origin) {
            case ORIGIN.ximalaya:
                items = await this.ximalayaApi.radioFollowings(originType.id, offset + 1, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.radioFollowings] Here will never be occured. [args]: ${radioId}, ${offset}, ${limit}`);
        }
        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public async podcastListOptions(origin: string): Promise<Array<IListOption>> {
        let h = md5(`sound.core.api.podcastListOptions(${origin})`);
        let result = cache12.get(h);
        if (result) return result;

        let item;
        switch (origin) {
            case ORIGIN.ximalaya:
                item = await this.ximalayaApi.podcastListOptions();
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.podcastListOptions] Here will never be occured. [args]: ${origin}`);
        }
        result = item;

        cache12.set(h, result);
        return result;
    }


    public async podcastOptionSubs(origin: string, params?: any): Promise<Array<IListOption>> {
        let h = md5(`sound.core.api.podcastOptionSubs(${origin}, ${JSON.stringify(params)})`);
        let result = cache12.get(h);
        if (result) return result;

        let item;
        switch (origin) {
            case ORIGIN.ximalaya:
                item = await this.ximalayaApi.podcastOptionSubs(params.category, params.subCategory);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.podcastOptionSubs] Here will never be occured. [args]: ${origin}, ${JSON.stringify(params)}`);
        }
        result = item;

        cache12.set(h, result);
        return result;
    }


    public async podcastListCount(origin: string, params?: any): Promise<number> {
        let h = md5(`sound.core.api.podcastListCount(${origin}, ${JSON.stringify(params)})`);
        let result = cache12.get(h);
        if (result) return result;

        let item;
        switch (origin) {
            case ORIGIN.ximalaya:
                item = await this.ximalayaApi.podcastListCount(params.category, params.subCategory, params.meta);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.podcastListCount] Here will never be occured. [args]: ${origin}, ${JSON.stringify(params)}`);
        }
        result = item;

        cache12.set(h, result);
        return result;
    }


    public async podcastList(origin: string, params?: any, offset: number = 0, limit: number = 10): Promise<Array<IPodcast>> {
        let h = md5(`sound.core.api.podcastList(${origin}, ${JSON.stringify(params)}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let items;
        switch (origin) {
            case ORIGIN.ximalaya:
                items = await this.ximalayaApi.podcastList(params.category, params.subCategory, params.meta, params.sort, offset + 1, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.podcastList] Here will never be occured. [args]: ${origin}, ${offset}, ${limit}, ${JSON.stringify(params)}`);
        }
        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public async searchEpisodes(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IEpisode>> {
        let h = md5(`sound.core.api.searchEpisodes(${keyword}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let list = await Promise.all([
            this.ximalayaApi.searchEpisodes(keyword, offset + 1, limit),
            this.himalayaApi.searchEpisodes(keyword, offset + 1, limit),
        ]);

        let items = insertMerge(list);

        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public async searchPodcasts(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IPodcast>> {
        let h = md5(`sound.core.api.searchPodcasts(${keyword}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let list = await Promise.all([
            this.ximalayaApi.searchPodcasts(keyword, offset + 1, limit),
            this.himalayaApi.searchPodcasts(keyword, offset + 1, limit),
        ]);

        let items = insertMerge(list);

        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public async searchRadios(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IRadio>> {
        let h = md5(`sound.core.api.searchRadios(${keyword}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let list = await Promise.all([
            this.ximalayaApi.searchRadios(keyword, offset + 1, limit)
        ]);

        let items = insertMerge(list);

        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public async playLog(episodeId: string, seek: number): Promise<boolean> {
        let result;
        let originType = getOrigin(episodeId);
        switch (originType.origin) {
            case ORIGIN.qianqian:
            case ORIGIN.ximalaya:
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.playLog] Here will never be occured. [args]: ${episodeId} ${seek}`);
        }
        return result;
    }


    public resizeImageUrl(origin: string, url: string, limit: ESize | number): string {
        let item;
        switch (origin) {
            case ORIGIN.ximalaya:
                item = this.ximalayaApi.resizeImageUrl(url, limit);
                break;
            case ORIGIN.himalaya:
                item = this.himalayaApi.resizeImageUrl(url, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Sound.resizeImageUrl] Here will never be occured. [args]: ${origin}, ${url}, ${limit}`);
        }
        return item;
    }


    public async fromURL(input: string): Promise<Array<TSoundItems>> {
        let h = md5(`sound.core.api.fromURL(${input})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let futs = [];
        let chunks = input.split(' ');
        for (let chunk of chunks) {
            if (chunk.includes('ximalaya')) {
                futs.push(this.ximalayaApi.fromURL(chunk));
            }
            if (chunk.includes('himalaya')) {
                futs.push(this.himalayaApi.fromURL(chunk));
            }
        }
        if (futs.length == 0) return [];
        let list = await Promise.all(futs);
        result = makeItems([].concat(...list));

        cache12.set(h, result);
        return result;
    }
}


export const soundApi = new Sound();
