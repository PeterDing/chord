'use strict';

import { Logger, LogLevel } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';
const loggerWarning = new Logger(filenameToNodeName(__filename), LogLevel.Warning);

import { getRandomSample } from 'chord/base/node/random';
import { ASCII_LETTER_DIGIT } from 'chord/base/common/constants';

import { makeCookieJar, makeCookie, makeCookies, CookieJar, Cookie } from 'chord/base/node/cookies';
import { querystringify } from 'chord/base/node/url';
import { request, IRequestOptions, IResponse } from 'chord/base/node/_request';

import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { ILyric } from 'chord/music/api/lyric';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { TMusicItems } from 'chord/music/api/items';

import { ESize, resizeImageUrl } from 'chord/music/common/size';

import {
    makeSong,
    makeLyric,
    makeSongs,
    makeAlbum,
    makeAlbums,
    makeArtist,
    makeArtists,
    makeCollection,
    makeCollections,
} from "chord/music/kuwo/parser";

import { encryptQuery } from 'chord/music/kuwo/crypto';

const DOMAIN = 'kuwo.cn';
const LETTERS = Array.from(ASCII_LETTER_DIGIT);


/**
 * Kuwo Music Api
 */
export class KuwoMusicApi {

    static readonly HEADERS = {
        'Pragma': 'no-cache',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        'Accept': '*/*',
        // Referer is needed
        // 'Referer': 'http://h.kuwo.com/collect_detail.html?id=422425970&f=&from=&ch=',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    };

    static readonly BASICURL = 'https://www.kuwo.cn/';
    static readonly BASICURL_FLAC = 'https://mobi.kuwo.cn/';

    static readonly NODE_MAP = {
        audios: 'api/v1/www/music/playUrl',
        audios_flac: 'mobi.s',

        // No use this song node, it does not give audio url
        song: 'api/www/music/musicInfo',
        lyric: 'newh5/singles/songinfoandlrc',

        album: 'api/www/album/albumInfo',

        artist: 'api/www/artist/artist',
        artistSongs: 'api/www/artist/artistMusic',
        artistAlbums: 'api/www/artist/artistAlbum',

        collection: 'api/www/playlist/playListInfo',

        searchSongs: 'api/www/search/searchMusicBykeyWord',
        searchAlbums: 'api/www/search/searchAlbumBykeyWord',
        searchArtists: 'api/www/search/searchArtistBykeyWord',
        searchCollections: 'api/www/search/searchPlayListBykeyWord',
    }

    private csrf_token: string;
    private cookieJar: CookieJar;


    constructor() {
        this.cookieJar = makeCookieJar();
        this.init_token();
    }


    protected async init_token() {
        let url = KuwoMusicApi.BASICURL;
        let headers = { ...KuwoMusicApi.HEADERS };
        let options: IRequestOptions = { method: 'GET', headers: headers };
        let resp: IResponse = await request(url, options);
        this.setCookies(resp);
    }


    protected setCookies(resp: IResponse) {
        makeCookies(resp.headers['set-cookie'] || []).map((cookie: Cookie) => {
            if (cookie.key == 'kw_token') {
                this.csrf_token = cookie.value;
            }
            this.cookieJar.setCookie(cookie, KuwoMusicApi.BASICURL);
        });
        console.log('set-cookie:', resp.headers['set-cookie'], this.csrf_token);
    }


    /**
     * Request
     */
    public async request(node: string, apiParams: object, referer?: string, domain?: string): Promise<any | null> {
        domain = domain || KuwoMusicApi.BASICURL;
        let url = domain + node;
        let params = apiParams ? querystringify(apiParams) : null;

        let headers = !!referer ?
            { ...KuwoMusicApi.HEADERS, Referer: referer, csrf: this.csrf_token }
            : { ...KuwoMusicApi.HEADERS, Referer: KuwoMusicApi.BASICURL, csrf: this.csrf_token };

        url = url + '?' + params;
        let options: IRequestOptions = {
            method: 'GET',
            headers: headers,
            jar: this.cookieJar || null,
        };
        let resp: IResponse = await request(url, options);
        this.setCookies(resp);

        let json = resp.data;

        if (!(json.code == 200 || json.status == 200)) {
            loggerWarning.warning('[KuwoMusicApi.request] [Error]: (params, response):', options, json);
        }

        return json;
    }


    /**
     * Request flac audio
     */
    public async request_audio_flac(songId: string): Promise<any | null> {
        let domain = KuwoMusicApi.BASICURL_FLAC;
        let url = domain + KuwoMusicApi.NODE_MAP.audios_flac;

        let apiParams = {
            f: 'kuwo',
            q: encryptQuery('corp=kuwo&p2p=1&type=convert_url2&sig=0&format=flac&rid=' + songId),
        };
        let params = querystringify(apiParams);

        let headers = {
            'user-agent': 'okhttp/3.10.0',
        };

        url = url + '?' + params;
        let options: IRequestOptions = {
            method: 'GET',
            headers: headers,
            jar: null,
        };

        let resp: IResponse;

        try {
            resp = await request(url, options);
        } catch (e) {
            return null;
        }

        if (resp && resp.data.startsWith('format=flac')) {
            let body = resp.data;
            let kbps = /bitrate=(\d+)/.exec(body)[1];
            let url = /url=([^\s]+)/.exec(body)[1];
            return {
                kbps: Number.parseInt(kbps),
                url,
            }
        } else {
            return null;
        }
    }


    /**
     * Get audio urls, the songId must be number string
     */
    public async audios(songId: string, supKbps?: number): Promise<Array<IAudio>> {
        let br: string;
        let kbps: number;
        if (supKbps <= 128) {
            br = '128kmp3';
            kbps = 128;
        } else if (supKbps <= 192) {
            br = '192kmp3';
            kbps = 192;
        } else if (supKbps <= 320) {
            br = '320kmp3';
            kbps = 320;
        } else {
            kbps = 720;
        }

        // flac
        if (supKbps > 320) {
            let info = await this.request_audio_flac(songId);
            if (info) {
                let audios = [
                    {
                        format: 'flac',
                        size: null,
                        kbps: info['kbps'],
                        url: info['url'],
                        path: null,
                    }
                ];
                return audios;
            } else {
                br = '320kmp3';
                kbps = 320;
            }
        }

        let info = await this.request(
            KuwoMusicApi.NODE_MAP.audios,
            {
                mid: songId,
                format: 'flac',
                type: 'music',
                br,
            },
        );

        let audios = [
            {
                format: 'mp3',
                size: null,
                kbps,
                url: info['data'] && info['data']['url'],
                path: null,
            }
        ];
        return audios;
    }


    /**
     * Get a song, the songId must be number string
     */
    public async song(songId: string): Promise<ISong> {
        let json = await this.request(
            KuwoMusicApi.NODE_MAP.song,
            { mid: songId },
        );

        let info = json.data;
        let song = makeSong(info);
        return song;
    }


    public async lyric(songId: string): Promise<ILyric> {
        let info = await this.request(
            KuwoMusicApi.NODE_MAP.lyric,
            { musicId: songId },
            null,
            'http://m.kuwo.cn/'
        )
        return makeLyric(songId, info.data.lrclist);
    }


    /**
     * Get an album, the albumId must be number string
     */
    public async album(albumId: string): Promise<IAlbum> {
        let json = await this.request(
            KuwoMusicApi.NODE_MAP.album,
            {
                albumId,
                pn: 1,
                rn: 1000,
            },
        );

        let info = json.data;
        let album = makeAlbum(info);
        return album;
    }


    /**
     * Get an artist, the artistId must be number string
     */
    public async artist(artistId: string): Promise<IArtist> {
        let json = await this.request(
            KuwoMusicApi.NODE_MAP.artist,
            { artistid: artistId },
        );

        let info = json.data;
        let artist = makeArtist(info);
        return artist;
    }


    /**
     * Get songs of an artist, the artistId must be number string
     */
    public async artistSongs(artistId: string, page: number = 1, size: number = 10): Promise<Array<ISong>> {
        let json = await this.request(
            KuwoMusicApi.NODE_MAP.artistSongs,
            {
                artistid: artistId,
                pn: page,
                rn: size,
            },
        );

        let info = json.data.list;
        let songs = makeSongs(info);
        return songs;
    }


    /**
     * Get albums of an artist, the artistId must be number string
     */
    public async artistAlbums(artistId: string, page: number = 1, size: number = 10): Promise<Array<IAlbum>> {
        let json = await this.request(
            KuwoMusicApi.NODE_MAP.artistAlbums,
            {
                artistid: artistId,
                pn: page,
                rn: size,
            },
        );

        let info = json.data.albumList;
        let albums = makeAlbums(info);
        return albums;
    }


    /**
     * Get a collection, the collectionId must be number string
     */
    public async collection(collectionId: string, page: number = 1, size: number = 100): Promise<ICollection> {
        let json = await this.request(
            KuwoMusicApi.NODE_MAP.collection,
            {
                pid: collectionId,
                pn: page,
                rn: size,
            },
        );

        let info = json && json.data;
        let collection = makeCollection(info);
        return collection;
    }


    /**
     * Search Songs
     */
    public async searchSongs(keyword: string, page: number = 1, size: number = 10): Promise<Array<ISong>> {
        let json = await this.request(
            KuwoMusicApi.NODE_MAP.searchSongs,
            {
                key: keyword.replace(/\s+/g, '+'),
                pn: page,
                rn: size,
            },
        );

        let info = json && json.data && json.data.list;
        let songs = makeSongs(info);
        return songs;
    }


    /**
     * Search albums
     */
    public async searchAlbums(keyword: string, page: number = 1, size: number = 10): Promise<Array<IAlbum>> {
        let json = await this.request(
            KuwoMusicApi.NODE_MAP.searchAlbums,
            {
                key: keyword.replace(/\s+/g, '+'),
                pn: page,
                rn: size,
            },
        );

        let info = json && json.data && json.data.albumList;
        let albums = makeAlbums(info);
        return albums;
    }


    public async searchArtists(keyword: string, page: number = 1, size: number = 10): Promise<Array<IArtist>> {
        let json = await this.request(
            KuwoMusicApi.NODE_MAP.searchArtists,
            {
                key: keyword.replace(/\s+/g, '+'),
                pn: page,
                rn: size,
            },
        );

        let info = json && json.data && json.data.artistList;
        let artists = makeArtists(info);
        return artists;
    }


    public async searchCollections(keyword: string, page: number = 1, size: number = 10): Promise<Array<ICollection>> {
        let json = await this.request(
            KuwoMusicApi.NODE_MAP.searchCollections,
            {
                key: keyword.replace(/\s+/g, '+'),
                pn: page,
                rn: size,
            },
        );

        let info = json && json.data && json.data.list;
        let collections = makeCollections(info);
        return collections;
    }


    /**
     * Record played song
     */
    public async playLog(songId: string, seek: number): Promise<boolean> {
        return false;
    }


    public resizeImageUrl(url: string, size: ESize | number): string {
        return resizeImageUrl(url, size, (url: string, size) => {
            if (url.match('/userp')) {
                if (size <= 150) {
                    size = 150;
                } else if (size > 150 && size <= 300) {
                    size = 300;
                } else if (size > 300 && size <= 500) {
                    size = 500;
                } else if (size > 500) {
                    size = 700;
                }
                url = url.replace(/_\d{3}\.jpg/, '.jpg')
                    .replace('.jpg', size.toString());
            } else {
                if (size <= 120) {
                    size = 120;
                } else if (size > 120 && size <= 300) {
                    size = 300;
                } else if (size > 300) {
                    size = 500;
                }
                url = url.replace(/starheads\/\d{3}/, 'starheads/' + size.toString())
                    .replace(/albumcover\/\d{3}/, 'albumcover/' + size.toString());
            }
            return url;
        });
    }


    public async fromURL(input: string): Promise<Array<TMusicItems>> {
        let chunks = input.split(' ');
        let items = [];
        for (let chunk of chunks) {
            let originId: string;
            let type: string;

            let matchList = [
                // song
                [/play_detail\/(\d+)/, 'song'],

                // artist
                [/singer_detail\/(\d+)/, 'artist'],

                // album
                [/album_detail\/(\d+)/, 'album'],

                // collection
                [/playlist_detail\/(\d+)/, 'collect'],
            ];
            for (let [re, tp] of matchList) {
                let m = (re as RegExp).exec(chunk);
                if (m) {
                    originId = m[1];
                    type = tp as string;
                    break;
                }
            }

            if (originId) {
                let item: any;
                switch (type) {
                    case 'song':
                        item = await this.song(originId);
                        items.push(item);
                        break;
                    case 'artist':
                        item = await this.artist(originId);
                        items.push(item);
                        break;
                    case 'album':
                        item = await this.album(originId);
                        items.push(item);
                        break;
                    case 'collect':
                        item = await this.collection(originId);
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
