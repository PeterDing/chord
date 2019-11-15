'use strict';

import { Logger, LogLevel } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';
const loggerWarning = new Logger(filenameToNodeName(__filename), LogLevel.Warning);

import { md5 } from 'chord/base/node/crypto';

import { Cookie, makeCookieJar, makeCookies } from 'chord/base/node/cookies';
import { querystringify, getHost } from 'chord/base/node/url';
import { request, IRequestOptions } from 'chord/base/node/_request';


import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';

import { IAccount } from 'chord/music/api/user';

import {
    makeSong,
    makeSongs,
    makeAlbum,
    makeAlbums,
    makeArtist,
    makeArtists,
    makeCollection,
    makeCollections,
} from "chord/music/xiami/parser";


const DOMAIN = 'xiami.com';


/**
 * Xiami Web Api
 */
export class XiamiApi {

    /**
     * For json
     */
    static readonly HEADERS1 = {
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6,ja;q=0.5',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
        'accept': 'application/json, text/plain, */*',
        'referer': 'https://www.xiami.com/',
        'sec-fetch-mode': 'cors',
        'authority': 'www.xiami.com',
        'sec-fetch-site': 'same-origin',
    };

    /**
     * For web page
     */
    static readonly HEADERS2 = {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
    };

    static readonly BASICURL = 'https://www.xiami.com/';

    static readonly NODE_MAP = {
        audios: 'song/getSongDetails',

        song: 'api/song/initialize',

        // album: 'api/album/getAlbumDetail',
        album: 'api/album/initialize',

        collection: 'api/collect/getCollectDetail',
        collectionSongs: 'api/collect/getCollectSongs',

        artist: 'api/artist/initialize',
        // artist: 'api/artist/getArtistDetail',
        artistAlbums: 'api/album/getArtistAlbums',
        artistSongs: 'api/album/getArtistSongs',

        searchSongs: 'api/search/searchSongs',
        searchAlbums: 'api/search/searchAlbums',
        searchArtists: 'api/search/searchArtists',
        searchCollections: 'api/search/searchCollects',
    };

    static readonly REQUEST_METHOD_MAP = {
        audios: 'GET',

        song: 'GET',

        album: 'GET',

        collection: 'GET',
        collectionSongs: 'GET',

        artist: 'GET',
        artistAlbums: 'GET',
        artistSongs: 'GET',

        searchSongs: 'GET',
        searchAlbums: 'GET',
        searchArtists: 'GET',
        searchCollections: 'GET',
    };

    // account
    private account: IAccount;
    private token: string;
    private cookies: { [key: string]: Cookie; } = {};

    // For user authority
    private userId: string;


    constructor() {
    }


    public reset() {
        this.cookies = {};
        this.token = null;
    }


    public makeSign(node: string, params: string) {
        let token = this.token || '';
        let s = token + '_xmMain_' + '/' + node + '_' + params;
        return md5(s);
    }


    public async getCookies(): Promise<void> {
        if (this.token) {
            return null;
        }

        let url = XiamiApi.BASICURL;
        let options: IRequestOptions = {
            method: 'GET',
            url: url,
            headers: XiamiApi.HEADERS2,
            gzip: true,
            resolveWithFullResponse: true,
        };
        let result: any = await request(options);
        if (result.headers.hasOwnProperty('set-cookie')) {
            makeCookies(result.headers['set-cookie']).forEach(cookie => {
                this.cookies[cookie.key] = cookie;
                if (cookie.key == 'xm_sg_tk') {
                    this.token = cookie.value.split('_')[0];
                }
            });
        } else {
            loggerWarning.warning('[XiamiApi.getCookies] [Error]: (params, response):', options, result);
        }
    }


    public async request(method: string, url: string, data?: string): Promise<any> {
        // init cookies
        await this.getCookies();

        let headers = { ...XiamiApi.HEADERS1 };

        let cookieJar = makeCookieJar();
        let cookies = { ...this.cookies };
        for (let key in cookies) {
            cookieJar.setCookie(cookies[key], 'http://' + DOMAIN);
        }

        let options: IRequestOptions = {
            method,
            url: url,
            jar: cookieJar,
            headers: headers,
            body: data,
            gzip: true,
            resolveWithFullResponse: false,
        };
        let result: any = await request(options);
        return result;
    }


    public async request_with_sign(
        method: string,
        node: string,
        apiParams: object,
        referer?: string,
        basicUrl?: string,
        excludedCookies: Array<string> = []
    ): Promise<any | null> {

        // init cookies
        await this.getCookies();

        let queryStr = JSON.stringify(apiParams);
        let sign = this.makeSign(node, queryStr);

        basicUrl = basicUrl || XiamiApi.BASICURL;

        let headers = !!referer ? { ...XiamiApi.HEADERS1, referer: referer } : { ...XiamiApi.HEADERS1 };
        headers['authority'] = getHost(basicUrl);

        let xmUA: string = undefined;
        if (window && (window as any).uabModule) xmUA = (window as any).uabModule.getUA();
        headers['xm-ua'] = xmUA;

        // Make cookie jar
        let cookieJar = makeCookieJar();
        let cookies = { ...this.cookies };
        excludedCookies.forEach(key => { delete cookies[key]; });
        for (let key in cookies) {
            cookieJar.setCookie(cookies[key], 'http://' + DOMAIN);
        }

        let url = basicUrl + node + '?' + querystringify({ _q: queryStr, _s: sign });
        let options: IRequestOptions = {
            method,
            url: url,
            jar: cookieJar,
            headers: headers,
            gzip: true,
            resolveWithFullResponse: false,
        };
        let result: any = await request(options);
        let json = JSON.parse(result.trim());

        // msg: "令牌过期"
        if (json.code == 'SG_TOKEN_EXPIRED') {
            this.reset();
            return this.request_with_sign(method, node, apiParams, referer, basicUrl, excludedCookies);
        }

        // TODO: Handle each errors
        if (json.code != 'SUCCESS') {
            loggerWarning.warning('[XiamiApi.request] [Error]: (params, response):', options, json);
        }

        return json;
    }


    public async request_without_sign(
        method: string,
        node: string,
        params?: object,
        data?: any,
        referer?: string,
        basicUrl?: string,
        excludedCookies: Array<string> = []
    ): Promise<any | null> {

        // init cookies
        await this.getCookies();

        basicUrl = basicUrl || XiamiApi.BASICURL;

        let headers = !!referer ? { ...XiamiApi.HEADERS1, referer: referer } : { ...XiamiApi.HEADERS1 };
        headers['authority'] = getHost(basicUrl);

        let xmUA: string = undefined;
        if (window && (window as any).uabModule) xmUA = (window as any).uabModule.getUA();
        headers['xm-ua'] = xmUA;

        if (data) headers['content-type'] = 'application/json';

        // Make cookie jar
        let cookieJar = makeCookieJar();
        let cookies = { ...this.cookies };
        excludedCookies.forEach(key => { delete cookies[key]; });
        for (let key in cookies) {
            cookieJar.setCookie(cookies[key], 'http://' + DOMAIN);
        }

        let url = basicUrl + node + (params ? '?' + querystringify(params) : '');
        let options: IRequestOptions = {
            method,
            url,
            jar: cookieJar,
            headers: headers,
            body: data,
            gzip: true,
            resolveWithFullResponse: false,
        };
        let result: any = await request(options);
        let json = JSON.parse(result.trim());

        // TODO: Handle each errors

        return json;
    }


    /**
     * @param songId is the original song id
     */
    public async audios(songId: string): Promise<Array<IAudio>> {
        let json = await this.request_with_sign(
            XiamiApi.REQUEST_METHOD_MAP.audios,
            XiamiApi.NODE_MAP.audios,
            { songIds: [songId] },
            `https://m.xiami.com/song/${songId}`,
            'https://node.xiami.com/',
        );
        let song = makeSong(json.result.data.songDetails[0]);
        return song.audios || [];
    }


    public async song(songId: string): Promise<ISong> {
        let json = await this.request_with_sign(
            XiamiApi.REQUEST_METHOD_MAP.song,
            XiamiApi.NODE_MAP.song,
            { songId },
            `https://www.xiami.com/song/${songId}`,
        );
        let song = makeSong(json.result.data);
        return song;
    }

    /**
     * Get an album
     *
     * @param albumId is the original id
     */
    public async album(albumId: string): Promise<IAlbum> {
        let json = await this.request_with_sign(
            XiamiApi.REQUEST_METHOD_MAP.album,
            XiamiApi.NODE_MAP.album,
            { albumId },
            `https://www.xiami.com/album/${albumId}`,
        );
        let album = makeAlbum(json.result.data.albumDetail);
        return album;
    }


    /**
     * Get an collection
     *
     * @param collectionId is the original id
     */
    public async collection(collectionId: string, page: number = 1, size: number = 100): Promise<ICollection> {
        let json = await this.request_with_sign(
            XiamiApi.REQUEST_METHOD_MAP.collection,
            XiamiApi.NODE_MAP.collection,
            { listId: collectionId },
            `https://www.xiami.com/collect/${collectionId}`,
        );
        let collection = makeCollection(json.result.data.collectDetail);
        let songs = await this.collectionSongs(collectionId, page, size);
        collection.songs = songs;
        return collection;
    }


    public async collectionSongs(collectionId: string, page: number = 1, size: number = 100): Promise<Array<ISong>> {
        let json = await this.request_with_sign(
            XiamiApi.REQUEST_METHOD_MAP.collectionSongs,
            XiamiApi.NODE_MAP.collectionSongs,
            {
                listId: collectionId,
                pagingVO: {
                    page,
                    pageSize: size,
                },
            },
            `https://www.xiami.com/collect/${collectionId}`,
        );
        let songs = makeSongs(json.result.data.songs);
        return songs;
    }


    /**
     * Login is needed
     */
    public async artist(artistId: string): Promise<IArtist> {
        let json = await this.request_with_sign(
            XiamiApi.REQUEST_METHOD_MAP.artist,
            XiamiApi.NODE_MAP.artist,
            { artistId },
            `https://www.xiami.com/list/album?artistId=${artistId}`,
        );
        let artist = makeArtist(json.result.data.artistDetail);
        return artist;
    }


    /**
     * Get albums amount of an artist, the artistId must be number string
     */
    public async artistAlbums(artistId: string, page: number = 1, size: number = 10): Promise<Array<IAlbum>> {
        let json = await this.request_with_sign(
            XiamiApi.REQUEST_METHOD_MAP.artistAlbums,
            XiamiApi.NODE_MAP.artistAlbums,
            {
                artistId,
                pagingVO: {
                    page: page,
                    pageSize: size
                },
                category: 0,
            },
            `https://www.xiami.com/list/album?artistId=${artistId}`,
        );
        let info = json.result.data.albums;
        let albums = makeAlbums(info);
        return albums;
    }


    /**
     * Get songs of an artist, the artistId must be number string
     */
    public async artistSongs(artistId: string, page: number = 1, size: number = 10): Promise<Array<ISong>> {
        let json = await this.request_with_sign(
            XiamiApi.REQUEST_METHOD_MAP.artistSongs,
            XiamiApi.NODE_MAP.artistSongs,
            {
                artistId,
                pagingVO: {
                    page: page,
                    pageSize: size
                },
            },
            `https://www.xiami.com/list/song?id=${artistId}&type=all`,
        );
        let info = json.result.data.songs;
        let songs = makeSongs(info);
        return songs;
    }


    public async searchSongs(keyword: string, page: number = 1, size: number = 10): Promise<Array<ISong>> {
        let json = await this.request_with_sign(
            XiamiApi.REQUEST_METHOD_MAP.searchSongs,
            XiamiApi.NODE_MAP.searchSongs,
            {
                key: keyword,
                pagingVO: {
                    page: page,
                    pageSize: size,
                }
            },
            `https://www.xiami.com/`,
        );
        let info = json.result.data.songs;
        let songs = makeSongs(info);
        return songs;
    }


    public async searchAlbums(keyword: string, page: number = 1, size: number = 10): Promise<Array<IAlbum>> {
        let json = await this.request_with_sign(
            XiamiApi.REQUEST_METHOD_MAP.searchAlbums,
            XiamiApi.NODE_MAP.searchAlbums,
            {
                key: keyword,
                pagingVO: {
                    page: page,
                    pageSize: size,
                }
            },
        );
        let info = json.result.data.albums;
        let albums = makeAlbums(info);
        return albums;
    }


    public async searchArtists(keyword: string, page: number = 1, size: number = 10): Promise<Array<IArtist>> {
        let json = await this.request_with_sign(
            XiamiApi.REQUEST_METHOD_MAP.searchArtists,
            XiamiApi.NODE_MAP.searchArtists,
            {
                key: keyword.replace(/\s+/g, '+'),
                pagingVO: {
                    page: page,
                    pageSize: size,
                }
            },
        );
        let info = json.result.data.artists;
        let artists = makeArtists(info);
        return artists;
    }


    public async searchCollections(keyword: string, page: number = 1, size: number = 10): Promise<Array<ICollection>> {
        let json = await this.request_with_sign(
            XiamiApi.REQUEST_METHOD_MAP.searchCollections,
            XiamiApi.NODE_MAP.searchCollections,
            {
                key: keyword.replace(/\s+/g, '+'),
                pagingVO: {
                    page: page,
                    pageSize: size,
                }
            },
        );
        let info = json.result.data.collects;
        let collections = makeCollections(info);
        return collections;
    }
}
