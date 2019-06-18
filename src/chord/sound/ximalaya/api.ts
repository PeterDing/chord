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

import { ESize } from 'chord/music/common/size';

import {
    makeDemoAudio,
    makeAudio,
    makeEpisode,
    makeEpisodes,
    makePodcast,
    makePodcasts,
    makeRadio,
    makeRadios,
    makePodcastListOptions,
    makePodcastOptionSubs,
} from 'chord/sound/ximalaya/parser';

import { getXmSign } from 'chord/sound/ximalaya/crypto';


export class XimalayaApi {

    static readonly SERVER = 'https://www.ximalaya.com/';

    static readonly HEADERS = {
        'Referer': 'https://www.ximalaya.com/',
        'Radio-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    };

    static readonly NODE_MAP = {
        demoAudio: 'mobile/track/pay',
        audio: 'revision/play/tracks',

        episode: 'revision/track/trackPageInfo',

        podcast: 'revision/album',
        podcastEpisodes: 'revision/album/getTracksList',

        search: 'revision/search',

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


    public async request(node: string, params: object, url: string = XimalayaApi.SERVER): Promise<any> {
        let paramstr = querystringify(params);
        url = url + node + '?' + paramstr;

        let headers = { ...XimalayaApi.HEADERS, 'xm-sign': getXmSign() };

        let options: IRequestOptions = {
            method: 'GET',
            url,
            headers,
            gzip: true,
            resolveWithFullResponse: false,
        };
        let result: any = await request(options);
        let json = JSON.parse(result.trim());

        if (json.ret && json.ret != 200 && json.ret != 0) {
            loggerWarning.warning('[XimalayaApi.request] [Error]: (params, response):', options, json);
        }

        return json;
    }


    /**
     * Error:
     *   "ret":726, "msg":"立即购买畅听"
     */
    public async demoAudios(episodeId: string): Promise<IAudio> {
        let json = await this.request(
            XimalayaApi.NODE_MAP.demoAudio + '/' + episodeId,
            {
                device: 'pc',
                isBackend: 'false',
                _: Date.now(),
            },
            'https://mpay.ximalaya.com/',
        );
        if (json.ret == 726) return null;
        let audio = makeDemoAudio(json);
        return audio;
    }


    public async audios(episodeId: string): Promise<Array<IAudio>> {
        let json = await this.request(
            XimalayaApi.NODE_MAP.audio,
            { trackIds: episodeId },
        );
        let audio;
        let url = json.data.tracksForAudioPlay[0].src;
        if (url) {
            audio = makeAudio(url);
        } else {
            audio = await this.demoAudios(episodeId);
        };
        return audio ? [audio] : [];
    }


    public async episode(episodeId: string): Promise<IEpisode> {
        let json = await this.request(
            XimalayaApi.NODE_MAP.episode,
            { trackId: episodeId },
        );
        return makeEpisode(json.data);
    }


    public async podcast(podcastId: string): Promise<IPodcast> {
        let json = await this.request(
            XimalayaApi.NODE_MAP.podcast,
            { albumId: podcastId },
        );
        return makePodcast(json.data);
    }


    public async podcastEpisodeCount(podcastId: string): Promise<number> {
        let json = await this.request(
            XimalayaApi.NODE_MAP.podcastEpisodes,
            {
                albumId: podcastId,
                pageNum: 1,
                sort: 1,
            },
        );
        return json.data.trackTotalCount;
    }


    // order:
    //     0 正序
    //     1 倒序
    public async podcastEpisodes(podcastId: string, page: number = 1, order: string = '1'): Promise<Array<IEpisode>> {
        let json = await this.request(
            XimalayaApi.NODE_MAP.podcastEpisodes,
            {
                albumId: podcastId,
                pageNum: page,
                sort: order,
            },
        );
        let episodes = makeEpisodes(json.data.tracks);
        if (episodes.length == 0) return [];

        let episode = await this.episode(episodes[0].episodeOriginalId);
        let {
            radioId,
            radioOriginalId,
            radioName,
            radioCoverUrl,
            podcastName,
            podcastCoverUrl,
            description,
        } = episode;
        return episodes.map(s => ({
            ...s,
            radioId,
            radioOriginalId,
            radioName,
            radioCoverUrl,
            podcastName,
            podcastCoverUrl,
            description,
        }));
    }


    public async search(type: string, keyword: string, page: number = 1, size: number = 10): Promise<any> {
        let json = await this.request(
            XimalayaApi.NODE_MAP.search,
            {
                core: type,
                kw: keyword,
                page,
                rows: size,
                spellchecker: 'true',
                condition: 'relation', // play, recent
                device: 'iPhone',
            },
        );
        return json;
    }


    public async searchEpisodes(keyword: string, page: number = 1, size: number = 10): Promise<Array<IEpisode>> {
        let json = await this.search('track', keyword, page, size);
        return makeEpisodes(json.data.result.response.docs);
    }


    public async searchPodcasts(keyword: string, page: number = 1, size: number = 10): Promise<Array<IPodcast>> {
        let json = await this.search('album', keyword, page, size);
        return makePodcasts(json.data.result.response.docs);
    }


    public async searchRadios(keyword: string, page: number = 1, size: number = 10): Promise<Array<IRadio>> {
        let json = await this.search('user', keyword, page, size);
        return makeRadios(json.data.result.response.docs);
    }


    public async radio(radioId: string): Promise<IRadio> {
        let json = await this.request(
            XimalayaApi.NODE_MAP.radioBasic,
            {
                uid: radioId,
            },
        );
        let radio = makeRadio(json.data);

        json = await this.request(
            XimalayaApi.NODE_MAP.radioAddons,
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
            XimalayaApi.NODE_MAP.radioEpisodes,
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
            XimalayaApi.NODE_MAP.radioEpisodes,
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
            XimalayaApi.NODE_MAP.radioFavoritePodcasts,
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
            XimalayaApi.NODE_MAP.radioFavoritePodcasts,
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
            XimalayaApi.NODE_MAP.radioPodcasts,
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
            XimalayaApi.NODE_MAP.radioPodcasts,
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
            XimalayaApi.NODE_MAP.radioFollowers,
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
            XimalayaApi.NODE_MAP.radioFollowers,
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
            XimalayaApi.NODE_MAP.radioFollowings,
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
            XimalayaApi.NODE_MAP.radioFollowings,
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
            XimalayaApi.NODE_MAP.podcastListOptions,
            {},
        );
        return makePodcastListOptions(json.data);
    }


    public async podcastOptionSubs(category: string, subCategory: string): Promise<Array<IListOption>> {
        let json = await this.request(
            XimalayaApi.NODE_MAP.podcastOptionSubs,
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
            XimalayaApi.NODE_MAP.podcastList,
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
            XimalayaApi.NODE_MAP.podcastList,
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
        if (size < ESize.Middle) {
            // Big
            return url + '!strip=1&quality=7&magick=webp&op_type=5&upload_type=album&name=mobile_large&device_type=ios';
        } else {
            // small
            return url + '!strip=1&quality=7&magick=webp&op_type=5&upload_type=cover&name=web_large&device_type=ios';
        }
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
                [/\w+\/\d+\/(\d+)/, 'episode'],

                // podcast
                [/\w+\/(\d+)/, 'podcast'],
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
