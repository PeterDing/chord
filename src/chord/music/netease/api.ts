'use strict';

import { ok } from 'chord/base/common/assert';
import { md5 } from 'chord/base/node/crypto';

import { jsonDumpValue } from 'chord/base/common/json';

import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';

import { makeCookieJar, makeCookieFrom, CookieJar } from 'chord/base/node/cookies';
import { request, IRequestOptions } from 'chord/base/node/_request';

import { encrypt } from 'chord/music/netease/crypto';
import { initiateCookies } from 'chord/music/netease/util';

import {
    makeAudio,
    makeSong,
    makeSongs,
    makeAlbum,
    makeAlbums,
    makeCollection,
    makeCollections,
    makeArtist,
    makeArtists,
    makeArtistAlbums,
} from 'chord/music/netease/parser';

const MAX_RETRY = 3;


export class NeteaseMusicApi {

    static readonly HEADERS = {
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        'Accept': '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'http://music.163.com/m',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    };

    static readonly WEB_HEADERS = {
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,ja;q=0.6,zh-TW;q=0.5',
    };

    static readonly BASICURL = 'http://music.163.com/';

    static readonly NODE_MAP = {
        login: 'weapi/login',
        loginRefresh: 'weapi/login/token/refresh',

        audio: 'weapi/song/enhance/player/url',
        song: 'weapi/v3/song/detail',
        album: 'weapi/v1/album',
        collection: 'weapi/v3/playlist/detail',

        artist: 'weapi/v1/artist',
        artistSongs: 'weapi/v1/artist',
        artistAlbums: 'weapi/artist/albums',

        search: 'weapi/search/get',

        similarSongs: 'weapi/v1/discovery/simiSong',
        similarArtists: 'weapi/discovery/simiArtist',
        similarCollections: 'weapi/discovery/simiPlaylist',
    }

    static cookieJar: CookieJar;


    constructor() {
        if (!NeteaseMusicApi.cookieJar) {
            let cookieJar = makeCookieJar([]);
            initiateCookies().forEach(cookie => {
                let domain = cookie.domain;
                cookieJar.setCookie(cookie, domain.startsWith('http') ? domain : 'http://' + domain);
            });
            NeteaseMusicApi.cookieJar = cookieJar;
        }
    }


    public async request(node: string, data: any, init: boolean = false, retry: number = 0): Promise<any> {
        let url = NeteaseMusicApi.BASICURL + node;

        let options: IRequestOptions = {
            method: 'POST',
            url: url,
            jar: NeteaseMusicApi.cookieJar || null,
            headers: NeteaseMusicApi.HEADERS,
            form: encrypt(jsonDumpValue(data)),
            gzip: true,
            json: true,
            resolveWithFullResponse: init,
        };

        let result = await request(options);

        // retry
        if (!result && retry < MAX_RETRY) return this.request(node, data, init, retry + 1);

        ok(result, `[ERROR] [NeteaseMusicApi.request]: result is ${result}`);

        let resultCode = init ? result.body['code'] : result['code'];
        ok(resultCode == 200, `[ERROR] [NeteaseMusicApi.request]: result.code is ${resultCode}, result is ${JSON.stringify(result)}`);
        return result;
    }


    public async login(username: string, password: string): Promise<any> {
        let node = NeteaseMusicApi.NODE_MAP.login;
        let data = {
            username,
            password: md5(password),
            rememberLogin: 'true',
        };
        let result = await this.request(node, data, true);

        // set user cookies
        result.headers['set-cookie'].forEach(cookieStr => {
            let cookie = makeCookieFrom(cookieStr);
            let domain = cookie.domain;
            NeteaseMusicApi.cookieJar.setCookie(cookie, domain.startsWith('http') ? domain : 'http://' + domain);
        });

        return result;
    }


    public async loginRefresh(): Promise<any> {
        let node = NeteaseMusicApi.NODE_MAP.loginRefresh;
        let data = {
            csrf_token: '',
        };

        let r = await this.request(node, data, true);
        return r.headers;
    }


    /**
     * to get directly link
     * http://music.163.com/song/media/outer/url?id=${songId}.mp3
     */
    public async audios(songId: string): Promise<Array<IAudio>> {
        let node = NeteaseMusicApi.NODE_MAP.audio;
        let data = {
            ids: [songId],
            br: 999000,
            csrf_token: '',
        };
        let json = await this.request(node, data);
        return [makeAudio(json['data'][0])];
    }


    public async songsAudios(songIds: Array<string>): Promise<Array<Array<IAudio>>> {
        let node = NeteaseMusicApi.NODE_MAP.audio;
        let data = {
            ids: songIds,
            br: 999000,
            csrf_token: '',
        };
        let json = await this.request(node, data);
        let songsAudios = json['data'].map(info => [makeAudio(info)]);
        return songsAudios;
    }


    public async song(songId: string): Promise<ISong> {
        let node = NeteaseMusicApi.NODE_MAP.song;
        let data = {
            c: [{ id: songId }],
            ids: [songId],
            csrf_token: '',
        };
        let json = await this.request(node, data);
        return makeSong(json['songs'][0]);
    }


    public async album(albumId: string): Promise<IAlbum> {
        let node = NeteaseMusicApi.NODE_MAP.album + '/' + albumId;
        let data = {
            csrf_token: '',
        };
        let json = await this.request(node, data);
        return makeAlbum(json);
    }

    public async artist(artistId: string): Promise<IArtist> {
        let node = NeteaseMusicApi.NODE_MAP.artist + '/' + artistId;
        let data = {
            csrf_token: '',
        };
        let json = await this.request(node, data);
        return makeArtist(json);
    }

    /**
     * There gets an artist's top 50 songs
     * It can't be more
     */
    public async artistSongs(artistId: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let { songs } = await this.artist(artistId);
        return songs;
    }

    public async artistAlbums(artistId: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let node = NeteaseMusicApi.NODE_MAP.artistAlbums + '/' + artistId;
        let data = {
            offset: offset,
            total: true,
            limit: limit,
            csrf_token: '',
        };
        let json = await this.request(node, data);
        return makeArtistAlbums(json);
    }

    public async collection(collectionId: string): Promise<ICollection> {
        let node = NeteaseMusicApi.NODE_MAP.collection;
        let data = {
            id: collectionId,
            total: true,
            offest: 0,
            limit: 1000,
            n: 1000,
            csrf_token: '',
        };
        let json = await this.request(node, data);
        return makeCollection(json['playlist']);
    }

    /**
     * Search
     *
     * data params:
     * @type:
     * 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
     */
    public async search(type: number, keyword: string, offset: number = 0, limit: number = 10): Promise<any> {
        let node = NeteaseMusicApi.NODE_MAP.search;
        let data = {
            s: keyword,
            total: true,
            offset,
            limit,
            type,
            strategy: 5,
            queryCorrect: true,
            csrf_token: '',
        };
        let json = await this.request(node, data);
        return json;
    }


    /**
     * Search songs
     *
     * type = 1
     */
    public async searchSongs(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let json = await this.search(1, keyword, offset, limit);
        return makeSongs(json['result']['songs'] || []);
    }


    /**
     * Search albums
     * type = 10
     */
    public async searchAlbums(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let json = await this.search(10, keyword, offset, limit);
        return makeAlbums(json['result']['albums'] || []);
    }


    /**
     * Search artists
     *
     * type = 100
     */
    public async searchArtists(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IArtist>> {
        let json = await this.search(100, keyword, offset, limit);
        return makeArtists(json['result']['artists'] || []);
    }


    /**
     * Search collections
     * type = 1000
     */
    public async searchCollections(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let json = await this.search(1000, keyword, offset, limit);
        return makeCollections(json['result']['playlists'] || []);
    }


    /**
     * Netease only return 5 similar songs
     */
    public async similarSongs(songId: string, limit: number = 5): Promise<Array<ISong>> {
        let node = NeteaseMusicApi.NODE_MAP.similarSongs;
        let data = {
            songid: songId,
        };
        let json = await this.request(node, data);
        return makeSongs(json['songs']);
    }


    /**
     * Netease doesn't provide similar albums api
     */
    public async similarAlbums(albumId: string, limit: number = 5): Promise<Array<IAlbum>> {
        return [];
    }


    /**
     * NO Use It
     *
     * WARN: This api return {"code":301}
     */
    public async similarArtists(artistId: string, limit: number = 5): Promise<Array<IArtist>> {
        let node = NeteaseMusicApi.NODE_MAP.similarArtists;
        let data = {
            artistid: artistId,
            csrf_token: '',
        };
        let json = await this.request(node, data);
        return makeArtists(json['artists']);
    }


    public async similarCollections(collectionId: string, limit: number = 5): Promise<Array<ICollection>> {
        let url = `https://music.163.com/playlist?id=${collectionId}`
        let options: IRequestOptions = {
            method: 'GET',
            url: url,
            headers: NeteaseMusicApi.WEB_HEADERS,
            gzip: true,
        };

        let body = await request(options);

        let collectionIds = new Set();
        let re = /sname f-fs1 s-fc0" href="\/playlist\?id=(\d+)/g;
        let group;
        while (group = re.exec(<any>body)) {
            collectionIds.add(group[1]);
        }

        let collections = await Promise.all(Array.from(collectionIds).map(collectionId => this.collection(collectionId)));
        return collections;
    }


    /**
     * Netease only return 3 collections
     */
    public async songBelongsToCollections(songId: string, limit: number = 5): Promise<Array<ICollection>> {
        let node = NeteaseMusicApi.NODE_MAP.similarCollections;
        let data = {
            songid: songId,
        };
        let json = await this.request(node, data);
        return makeCollections(json['playlists']);
    }
}


export const neteaseMusicApi = new NeteaseMusicApi();
