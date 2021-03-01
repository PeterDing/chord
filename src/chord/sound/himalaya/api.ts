'use strict';

import { Logger, LogLevel } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';
const loggerWarning = new Logger(filenameToNodeName(__filename), LogLevel.Warning);

import { querystringify } from 'chord/base/node/url';
import { request, IRequestOptions } from 'chord/base/node/_request';

import { IListOption } from 'chord/music/api/listOption';

import { IAudio } from 'chord/music/api/audio';
import { IEpisode } from 'chord/sound/api/episode';
import { IPodcast } from 'chord/sound/api/podcast';
import { IRadio } from 'chord/sound/api/radio';
import { TSoundItems } from 'chord/sound/api/items';

import { ESize, resizeImageUrl } from 'chord/music/common/size';

import {
    makeEpisode,
    makeEpisodes,
    makePodcast,
    makePodcasts,
} from 'chord/sound/himalaya/parser';


export class HimalayaApi {

    static readonly SERVER = 'https://api.himalaya.com/';

    static readonly HEADERS = {
        'Referer': 'https://www.himalaya.com/',
        'Radio-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    };

    static readonly NODE_MAP = {
        demoAudio: 'mobile/track/pay',
        audio: 'revision/play/tracks',

        episode: 'himalaya-portal/v1/share/track/detail/',

        podcast: 'himalaya-portal/v1/share/album/',
        podcastEpisodes: 'himalaya-portal/v1/share/track/',

        search: 'himalaya-portal/v2/search/keyword',

        radioBasic: 'revision/user/basic',
        radioAddons: 'revision/user',
        radioEpisodes: 'revision/user/track',
        radioPodcasts: 'revision/user/pub',
        radioFavoritePodcasts: 'revision/user/sub',
        radioFollowers: 'revision/user/fans',
        radioFollowings: 'revision/user/following',

        podcastListOptions: 'revision/category/allCategoryInfo',
        podcastOptionSubs: 'revision/category/detailCategoryPageInfo',
        podcastList: 'revision/category/queryCategoryPageAlbums',
    };


    constructor() {
    }


    public async request(uri: string, params?: object, timeout?: number): Promise<any> {
        let paramstr = params ? '?' + querystringify(params) : '';
        let url = HimalayaApi.SERVER + uri + paramstr;

        let headers = { ...HimalayaApi.HEADERS };

        let options: IRequestOptions = {
            method: 'GET',
            url,
            headers,
            gzip: true,
            timeout,
            resolveWithFullResponse: false,
        };
        let result: any = await request(options);
        let json = JSON.parse(result.trim());

        if (json.ret && json.ret != 200 && json.ret != 0) {
            loggerWarning.warning('[HimalayaApi.request] [Error]: (params, response):', options, json);
        }

        return json;
    }


    public async audios(episodeId: string, supKbps?: number): Promise<Array<IAudio>> {
        let episode = await this.episode(episodeId);
        return episode.audios;
    }


    public async episode(episodeId: string): Promise<IEpisode> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.episode + episodeId,
        );
        return makeEpisode(json.data);
    }


    public async podcast(podcastId: string): Promise<IPodcast> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.podcast + podcastId,
        );
        return makePodcast(json.data);
    }


    public async podcastEpisodeCount(podcastId: string): Promise<number> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.podcastEpisodes + podcastId,
            {
                pageIndex: 1,
                pageSize: 1,
                orderField: 1,
            },
        );
        return json.data.totalCount;
    }


    // order:
    //     0 正序
    //     1 倒序
    public async podcastEpisodes(podcastId: string, page: number = 1, size: number = 30, order: string = '1'): Promise<Array<IEpisode>> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.podcastEpisodes + podcastId,
            {
                pageIndex: page,
                pageSize: size,
                orderField: order,
            },
        );
        return makeEpisodes(json.data.list);
    }


    public async search(type: string, keyword: string, page: number = 1, size: number = 10): Promise<any> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.search,
            {
                keyword,
                core: type,
                pageId: page,
                pageSize: size,
            },
            5000,
        );
        return json;
    }


    public async searchEpisodes(keyword: string, page: number = 1, size: number = 10): Promise<Array<IEpisode>> {
        let json;
        try {
            json = await this.search('track', keyword, page, size);
        } catch {
            return [];
        }
        return makeEpisodes(json.list.map(i => (i.track.nickname = i.user.nickname, i.track)));
    }


    public async searchPodcasts(keyword: string, page: number = 1, size: number = 10): Promise<Array<IPodcast>> {
        let json;
        try {
            json = await this.search('album', keyword, page, size);
        } catch {
            return [];
        }
        return makePodcasts(json.list.map(i => (i.album.nickname = i.user.nickname, i.album)));
    }


    public async searchRadios(keyword: string, page: number = 1, size: number = 10): Promise<Array<IRadio>> {
        let json = await this.search('user', keyword, page, size);
        return makeRadios(json.data.result.response.docs);
    }


    public async radio(radioId: string): Promise<IRadio> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.radioBasic,
            {
                uid: radioId,
            },
        );
        let radio = makeRadio(json.data);

        json = await this.request(
            HimalayaApi.NODE_MAP.radioAddons,
            {
                uid: radioId,
            },
        );

        return {
            ...radio,
            episodeCount: json.data.trackPageInfo.totalCount,
            followingCount: json.data.followingPageInfo.totalCount,
            podcastCount: json.data.pubPageInfo.totalCount,
            favoritePodcastCount: json.data.subscriptionPageInfo.totalCount,
        };
    }


    public async radioEpisodeCount(radioId: string, keyword: string = ''): Promise<number> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.radioEpisodes,
            {
                page: 1,
                pageSize: 1,
                keyWord: keyword || '',
                uid: radioId,
                orderType: 2,
            },
        );
        return json.data.totalCount;
    }


    /**
     * Episodes the radio created
     *
     * order:
     *     1 正序
     *     2 倒序
     */
    public async radioEpisodes(
        radioId: string,
        page: number = 1,
        size: number = 10,
        order: number = 2,
        keyword: string = ''
    ): Promise<Array<IEpisode>> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.radioEpisodes,
            {
                page: page,
                pageSize: size,
                keyWord: '',
                uid: radioId,
                orderType: order,
            },
        );
        return makeEpisodes(json.data.trackList);
    }


    public async radioFavoritePodcastCount(radioId: string, keyword: string = ''): Promise<number> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.radioFavoritePodcasts,
            {
                page: 1,
                pageSize: 1,
                keyWord: keyword || '',
                uid: radioId,
                subType: 1,
            },
        );
        return json.data.totalCount;
    }


    /**
     * Podcasts the radio liked
     *
     * order:
     *     1 综合排序
     *     2 最近更新
     *     3 最近订阅
     */
    public async radioFavoritePodcasts(
        radioId: string,
        page: number = 1,
        size: number = 10,
        order: number = 1,
        keyword: string = ''
    ): Promise<Array<IPodcast>> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.radioFavoritePodcasts,
            {
                page: page,
                pageSize: size,
                keyWord: keyword || '',
                uid: radioId,
                subType: order,
            },
        );
        return makePodcasts(json.data.albumsInfo);
    }


    public async radioPodcastCount(radioId: string, keyword: string = ''): Promise<number> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.radioPodcasts,
            {
                page: 1,
                pageSize: 1,
                keyWord: keyword || '',
                uid: radioId,
                orderType: 2,
            },
        );
        return json.data.totalCount;
    }


    /**
     * Podcasts the radio created
     *
     * order:
     *     1 正序
     *     2 倒序
     */
    public async radioPodcasts(
        radioId: string,
        page: number = 1,
        size: number = 10,
        order: number = 2,
        keyword: string = ''
    ): Promise<Array<IPodcast>> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.radioPodcasts,
            {
                page: page,
                pageSize: size,
                keyWord: keyword || '',
                uid: radioId,
                orderType: order,
            },
        );
        return makePodcasts(json.data.albumList);
    }


    public async radioFollowerCount(radioId: string): Promise<number> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.radioFollowers,
            {
                page: 1,
                pageSize: 1,
                keyWord: '',
                uid: radioId,
            },
        );
        return json.data.totalCount;
    }


    public async radioFollowers(radioId: string, page: number = 0, size: number = 10): Promise<Array<IRadio>> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.radioFollowers,
            {
                page: page,
                pageSize: size,
                keyWord: '',
                uid: radioId,
            },
        );
        return makeRadios(json.data.fansPageInfo);
    }


    public async radioFollowingCount(radioId: string): Promise<number> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.radioFollowings,
            {
                page: 1,
                pageSize: 1,
                keyWord: '',
                uid: radioId,
            },
        );
        return json.data.totalCount;
    }


    public async radioFollowings(radioId: string, page: number = 1, size: number = 10): Promise<Array<IRadio>> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.radioFollowings,
            {
                page: page,
                pageSize: size,
                keyWord: '',
                uid: radioId,
            },
        );
        return makeRadios(json.data.followingsPageInfo);
    }


    public async podcastListOptions(): Promise<Array<IListOption>> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.podcastListOptions,
            {},
        );
        return makePodcastListOptions(json.data);
    }


    public async podcastOptionSubs(category: string, subCategory: string): Promise<Array<IListOption>> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.podcastOptionSubs,
            {
                category,
                subcategory: subCategory,
            },
        );

        let option = {
            id: null,
            name: '排序',
            type: 'sort',
            items: [
                {
                    id: '0',
                    name: '综合排序',
                    type: 'sort',
                },
                {
                    id: '2',
                    name: '播放最多',
                    type: 'sort',
                },
                {
                    id: '1',
                    name: '最近更新',
                    type: 'sort',
                }
            ],
        };
        let options = makePodcastOptionSubs(json.data);
        options.push(option);
        return options;
    }


    public async podcastListCount(
        category: string,
        subCategory: string,
        meta: string = ''
    ): Promise<number> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.podcastList,
            {
                category,
                subcategory: subCategory,
                meta,
                sort: '0',
                page: 1,
                perPage: 1,
            },
        );
        return json.data.total;
    }


    public async podcastList(
        category: string,
        subCategory: string,
        meta: string = '',
        sort: string = '0',
        page: number = 1,
        size: number = 10): Promise<Array<IPodcast>> {
        let json = await this.request(
            HimalayaApi.NODE_MAP.podcastList,
            {
                category,
                subcategory: subCategory,
                meta,
                sort,
                page,
                perPage: size,
            },
        );
        return makePodcasts(json.data.albums);
    }


    public resizeImageUrl(url: string, size: ESize | number): string {
        if (!url) return null;

        return resizeImageUrl(
            '', size,
            (_, size) => {
                if (url.includes('source')) {
                    return url.replace(/source\/.+/, 'source/' + size + 'x' + size + 'bb.jpg');
                } else if (url.includes('-oss-')) {
                    return url.replace(/w_\d+/, 'w_' + size).replace(/h_\d+/, 'h_' + size);
                } else {
                    return url;
                }
            });
    }


    public async fromURL(input: string): Promise<Array<TSoundItems>> {
        let chunks = input.split(' ');
        let items = [];
        for (let chunk of chunks) {
            let m;
            let originId;
            let type;

            let matchList = [
                // radio
                [/zhubo\/(\d+)/, 'radio'],

                // episode
                [/-podcasts\/[^\/]+\d+\/[^\/]+?(\d+)$/, 'episode'],

                // podcast
                [/-podcasts\/[^\/]+?(\d+)$/, 'podcast'],
            ];
            for (let [re, tp] of matchList) {
                m = (re as RegExp).exec(chunk);
                if (m) {
                    type = tp;
                    originId = m[1];
                    break;
                }
            }

            if (originId) {
                let item;
                switch (type) {
                    case 'episode':
                        item = await this.episode(originId);
                        items.push(item);
                        break;
                    case 'podcast':
                        item = await this.podcast(originId);
                        items.push(item);
                        break;
                    case 'radio':
                        item = await this.radio(originId);
                        items.push(item);
                        break;
                    default:
                        break;
                }
            }
        }

        return items;
    }
}
