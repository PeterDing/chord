'use strict';

import { ok } from 'chord/base/common/assert';
import { assign } from 'chord/base/common/objects';
import { md5 } from 'chord/base/node/crypto';
import { makeCookieJar, CookieJar } from 'chord/base/node/cookies';
import { querystringify, getHost } from 'chord/base/node/url';
import { request, IRequestOptions } from 'chord/base/node/_request';
import { Cookie } from 'tough-cookie';
import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import {
    makeSong,
    makeAlbum,
    makeArtist,
    makeCollection,

    makeAliSong,
    makeAliSongs,
    makeAliAlbum,
    makeAliAlbums,
    makeAliArtist,
    makeAliArtists,
    makeAliCollection,
    makeAliCollections,
} from "chord/music/xiami/parser";


/**
 * Xiami Web Api
 */
export class XiamiApi {

    /**
     * For XMLHttpRequest
     */
    static HEADERS1 = {
        'pragma': 'no-cache',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
        'accept': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01',
        'cache-control': 'no-cache',
        'authority': 'www.xiami.com',
        'x-requested-with': 'XMLHttpRequest',
        'referer': 'https://www.xiami.com/play?ids=/song/playlist/id/',
    };

    /**
     * For web page
     */
    static HEADERS2 = {
        'pragma': 'no-cache',
        'cache-control': 'no-cache',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
    };

    static BASICURL = 'https://www.xiami.com/song/playlist/';


    public async request(url: string, headers: any, json: boolean, errorMessage: string = 'Error at XiamiApi.request'): Promise<any> {
        let options: IRequestOptions = {
            method: 'GET',
            url: url,
            headers: headers,
            gzip: true,
            json: json,
        };
        let result: any = await request(options);
        if (json) {
            // if (!json.data || !json.data.trackList) {
            // throw new Error(json.message || 'no song data');
            // }
            ok(result.data && result.data.trackList, result.message || errorMessage);
        }
        return result;
    }


    /**
     * Web api
     *
     * Get single song.
     * songId is the original song id
     */
    public async song(songId: string): Promise<ISong> {
        let url = XiamiApi.BASICURL + `id/${songId}/cat/json`;
        let json = await this.request(url, XiamiApi.HEADERS1, true, 'no song data');
        let info = json.data.trackList[0];
        let song = makeSong(info);
        return song;
    }


    /**
     * Web api
     *
     * Get more than one song.
     * songIds need to be iterable
     */
    public async songs(songIds: Array<string>): Promise<Array<ISong>> {
        let url = XiamiApi.BASICURL + `id/${songIds.join('%2C')}/cat/json`;
        let json = await this.request(url, XiamiApi.HEADERS1, true, 'no song data');
        let songs = json.data.trackList.map(info => makeSong(info));
        return songs;
    }


    /**
     * Web api
     *
     * Get an album.
     */
    public async album(albumId: string): Promise<IAlbum> {
        let url = XiamiApi.BASICURL + `id/${albumId}/type/1/cat/json`;
        let json = await this.request(url, XiamiApi.HEADERS1, true, 'no album data');
        let album = makeAlbum(json);
        return album;
    }


    /**
     * Get an artist from web page 
     * Xiami has not supply an artist api
     */
    public async artist(artistId: string): Promise<IArtist> {
        let url = `https://www.xiami.com/artist/${artistId}`;
        let html = await this.request(url, XiamiApi.HEADERS2, false);
        let artist: IArtist = makeArtist(html);
        return artist;
    }


    /**
     * Get artist albums by offset page from web page
     * Using AliMusicApi.artistAlbums
     */
    // public async artistAlbum(artistId: string, page: number = 1): Promise<Array<IAlbum>> {
    // let _url = `https://www.xiami.com/artist/album-${artistId}?page=${page}`;
    // let options: IRequestOptions = {
    // method: 'GET',
    // url: _url,
    // headers: XiamiApi.HEADERS2,
    // gzip: true,
    // };
    // let html: any = await request(options);
    // let albums: Array<IAlbum> = makeArtistAlbums(html);
    // return albums;
    // }


    /**
     * Web api
     *
     * Get an collection
     */
    public async collection(collectionId: string): Promise<ICollection> {
        let url = XiamiApi.BASICURL + `id/${collectionId}/type/3/cat/json`;
        let json = await this.request(url, XiamiApi.HEADERS1, true, 'no collection data');
        let collection = makeCollection(json, collectionId);
        return collection;
    }


    /**
     * Search Album, using web page
     *
     * Album ids from web page are all string ids (not number ids),
     * so we must use XiamiApi.album to get number ids and albums info
     */
    public async searchAlbums(keyword: string): Promise<Array<IAlbum>> {
        let _keyword = escape(keyword);
        let url = `https://www.xiami.com/search?key=${_keyword}&pos=1`
        let html = await this.request(url, XiamiApi.HEADERS2, false);

        let albumIds = [];
        let chunks = html.split('<h5>专辑</h5>');
        let chunk = chunks[chunks.length - 1];
        let re = new RegExp('/album/(\\w+)"', 'g');
        let r;
        while (r = re.exec(chunk)) {
            if (albumIds.length && r[1] == albumIds[albumIds.length - 1]) {
                continue;
            }
            albumIds.push(r[1]);
        }
        let albums: Array<IAlbum> = [];
        let tasks = [];
        for (let albumId of albumIds) {
            let task = this.album(albumId).then(album => albums.push(album));
            tasks.push(task);
        }
        await Promise.all(tasks);
        return albums;
    }
}


/**
 * Alibaba Music Api
 */
export class AliMusicApi {

    static readonly HEADERS = {
        'Pragma': 'no-cache',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        'Accept': '*/*',
        // Referer is needed
        // 'Referer': 'http://h.xiami.com/collect_detail.html?id=422425970&f=&from=&ch=',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    };

    static readonly BASICURL = 'http://h5api.m.xiami.com/h5/';
    static readonly VERSION = '1.0';
    static readonly APPKEY = '23649156';
    static readonly JSV = '2.4.0';

    static readonly NODE_MAP = {
        // No use this song node, it does not give audio url
        song: 'mtop.alimusic.music.songservice.getsongdetail',
        songs: 'mtop.alimusic.music.songservice.getsongs',
        similarSongs: 'mtop.alimusic.recommend.songservice.getroamingsongs',

        album: 'mtop.alimusic.music.albumservice.getalbumdetail',
        albums: 'mtop.alimusic.music.albumservice.getalbums',

        artist: 'mtop.alimusic.music.artistservice.getartistdetail',
        artistAlbums: 'mtop.alimusic.music.albumservice.getartistalbums',
        artistSongs: 'mtop.alimusic.music.songservice.getartistsongs',
        similarArtists: 'mtop.alimusic.recommend.artistservice.getsimilarartists',

        collection: 'mtop.alimusic.music.list.collectservice.getcollectdetail',
        collections: 'mtop.alimusic.music.list.collectservice.getcollects',

        // genre: 'mtop.alimusic.music.genreservice.getgenredetail',  // no privilege

        recommandTags: 'mtop.alimusic.music.list.collectservice.getrecommendtags',
        hotTags: 'mtop.alimusic.music.list.collectservice.gethottags',

        // searchSongs: XXX Cookies must include 'uidXM=${userId}'
        searchSongs: 'mtop.alimusic.search.searchservice.searchsongs',

        // searchAlbums: XXX Cookies must include 'uidXM=${userId}'
        searchAlbums: 'mtop.alimusic.search.searchservice.searchalbums',
        searchArtists: 'mtop.alimusic.search.searchservice.searchartists',
        searchCollections: 'mtop.alimusic.search.searchservice.searchcollects',

        login: 'mtop.alimusic.xuser.facade.xiamiuserservice.login',
        userInfo: 'mtop.alimusic.xuser.facade.xiamiuserservice.getuserinfobyuserid',
        userFavorites: 'mtop.alimusic.fav.favoriteservice.getfavorites',
    }

    static token: string;
    static cookieJar: CookieJar;

    // For user authority
    static userId: string;
    static accessToken: string;
    static refreshToken: string;


    public static makeCookie(key: string, value: string): Cookie {
        let domain = getHost(AliMusicApi.BASICURL);
        return Cookie.fromJSON({key, value, domain});
    }


    public static reset() {
        AliMusicApi.token = null;
        AliMusicApi.cookieJar = null;
    }


    public makeQueryStr(params: object): string {
        let header = {
            platformId: 'h5',
            callId: Date.now(),
            appVersion: 1000000,
            resolution: '150*704',
            appId: 200,
            openId: 0,
        };
        if (AliMusicApi.accessToken) {
            header = assign({}, header, { accessToken: AliMusicApi.accessToken });
        }

        return JSON.stringify(
            {
                requestStr: JSON.stringify(
                    {
                        header: header,
                        model: params,
                    })
            }
        );
    }


    public makeSign(queryStr: string, time: number): string {
        let token = AliMusicApi.token || 'undefined';
        let str = token + '&' + time + '&' + AliMusicApi.APPKEY + '&' + queryStr;
        return md5(str);
    }


    public makeParamstr(time: number, sign: string, queryStr: string, node: string): string {
        let paramstr = querystringify({
            jsv: AliMusicApi.JSV,
            appKey: AliMusicApi.APPKEY,
            t: time,
            sign: sign,
            api: node,
            v: AliMusicApi.VERSION,
            type: 'originaljsonp',
            timeout: '200000',
            dataType: 'originaljsonp',
            AntiCreep: 'true',
            AntiFlood: 'true',
            callback: 'mtopjsonp1',
            data: queryStr,
        });
        return paramstr;
    }


    public async getToken(): Promise<any | null> {
        if (AliMusicApi.token) {
            return null;
        }

        let etag = await this.getEtag();

        return this.request(
            AliMusicApi.NODE_MAP.album,
            { albumId: '1' },
            'http://h.xiami.com/album_detail.html?id=1&f=&from=&ch=',
            true,
        ).then((_) => {
            this.setEtagCookie(etag);
        });
    }


    public setUserIdCookie(userId?: string): void {
        ok(AliMusicApi.cookieJar, 'no AliMusicApi.cookieJar');
        ok(userId || AliMusicApi.userId, 'no userId');

        let key = 'uidXM';
        let value = AliMusicApi.userId;
        let cookie = AliMusicApi.makeCookie(key, value);
        let domain = cookie.domain;

        AliMusicApi.cookieJar.setCookie(cookie, domain.startsWith('http') ? domain : 'http://' + domain);
    }


    /**
     * Etag for anti spider
     */
    public async getEtag(): Promise<string> {
        let url = 'http://log.mmstat.com/eg.js';
        let options: IRequestOptions = {
            method: 'GET',
            url: url,
            jar: AliMusicApi.cookieJar || null,
            headers: { ...AliMusicApi.HEADERS },
            gzip: true,
            resolveWithFullResponse: true,
        };
        let result: any = await request(options);
        return result.headers['Etag'];
    }


    public setEtagCookie(etag: string): void {
        ok(AliMusicApi.cookieJar, 'no AliMusicApi.cookieJar');

        let key = 'cna';
        let value = etag;
        let cookie = AliMusicApi.makeCookie(key, value);
        let domain = cookie.domain;

        AliMusicApi.cookieJar.setCookie(cookie, domain.startsWith('http') ? domain : 'http://' + domain);
    }


    /**
     * If init is true, request returns response, NOT json
     */
    public async request(node: string, apiParams: object, referer?: string, init: boolean = false): Promise<any | null> {
        if (!init) {
            await this.getToken();
        }

        let url = AliMusicApi.BASICURL + node + '/' + AliMusicApi.VERSION + '/'
        let queryStr = this.makeQueryStr(apiParams);
        let time = Date.now();
        let sign = this.makeSign(queryStr, time);
        let params = this.makeParamstr(time, sign, queryStr, node);

        let headers = !!referer ? { ...AliMusicApi.HEADERS, Referer: referer } : { ...AliMusicApi.HEADERS };

        url = url + '?' + params;
        let options: IRequestOptions = {
            method: 'GET',
            url: url,
            jar: AliMusicApi.cookieJar || null,
            headers: headers,
            gzip: true,
            resolveWithFullResponse: init,
        };
        let result: any = await request(options);
        if (init && result.headers.hasOwnProperty('set-cookie')) {
            let cookieJar = makeCookieJar(result.headers['set-cookie']);
            AliMusicApi.cookieJar = cookieJar;
            for (let c of cookieJar.getCookies(AliMusicApi.BASICURL)) {
                if (c.key == '_m_h5_tk') {
                    AliMusicApi.token = c.value.split('_')[0];
                    break;
                }
            }
            this.setUserIdCookie();
            return null;
        }
        let json = JSON.parse(result.trim().slice(11, -1));

        // TODO: Handle each errors
        if (json.ret[0].search('SUCCESS') == -1) {
            console.log('[AliMusicApi.request] [Error]:')
            console.log(json);
        }

        // FAIL_SYS_TOKEN_EXOIRED::令牌过期
        if (json.ret && json.ret[0].search('FAIL_SYS_TOKEN_EXOIRED') != -1) {
            AliMusicApi.reset();
            await this.getToken();
            return this.request(node, apiParams, referer, init);
        }
        return json;
    }


    /**
     * Get audio urls, the songId must be number string
     */
    public async audios(songId: string): Promise<Array<IAudio>> {
        let song = await this.song(songId);
        return song.audios;
    }


    /**
     * Get many songs' audios
     */
    public async songsAudios(songIds: Array<string>): Promise<Array<Array<IAudio>>> {
        let songs = await this.songs(songIds);
        return songs.map(song => song.audios);
    }


    /**
     * Get a song, the songId must be number string
     */
    public async song(songId: string): Promise<ISong> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.songs,
            { songIds: [songId] },
            `http://h.xiami.com/song.html?id=${songId}&f=&from=&ch=`,
        );

        let info = json.data.data.songs[0];
        let song = makeAliSong(info);
        return song;
    }


    /**
     * Get songs, the songId must be number string
     */
    public async songs(songIds: Array<string>): Promise<Array<ISong>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.songs,
            { songIds },
            `http://h.xiami.com/song.html?id=${songIds[0]}&f=&from=&ch=`,
        );

        let info = json.data.data.songs;
        let songs = makeAliSongs(info);
        return songs;
    }


    /**
     * Get similer songs, the songId must be number string
     */
    public async similarSongs(songId: string, size: number = 10): Promise<Array<ISong>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.similarSongs,
            {
                limit: size,
                quality: 'l',
                context: '',
                songId: parseInt(songId),
            },
            `http://h.xiami.com/song.html?id=${songId}&f=&from=&ch=`,
        );

        let info = json.data.data.songs;
        let songs = makeAliSongs(info);
        return songs;
    }


    /**
     * Get an album, the albumId must be number string
     */
    public async album(albumId: string): Promise<IAlbum> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.album,
            { albumId },
            `http://h.xiami.com/album_detail.html?id=${albumId}&f=&from=&ch=`,
        );

        let info = json.data.data.albumDetail;
        let album = makeAliAlbum(info);
        return album;
    }


    public async albums(albumIds: Array<string>): Promise<Array<IAlbum>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.albums,
            { albumIds },
            `http://h.xiami.com/album_detail.html?id=${albumIds[0]}&f=&from=&ch=`,
        );

        let info = json.data.data.albums;
        let albums = makeAliAlbums(info);
        return albums;
    }


    /**
     * Get an artist, the artistId must be number string
     */
    public async artist(artistId: string): Promise<IArtist> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.artist,
            { artistId },
            `http://h.xiami.com/artist_detail.html?id=${artistId}&f=&from=&ch=`,
        );

        let info = json.data.data['artistDetailVO'];
        let artist = makeAliArtist(info);
        return artist;
    }


    /**
     * Get albums of an artist, the artistId must be number string
     */
    public async artistAlbums(artistId: string, page: number = 1, size: number = 10): Promise<Array<IAlbum>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.artistAlbums,
            {
                artistId: artistId,
                pagingVO: {
                    page: page,
                    pageSize: size,
                }
            },
            `http://h.xiami.com/artist_detail.html?id=${artistId}&f=&from=&ch=`,
        );

        let info = json.data.data.albums;
        let albums = makeAliAlbums(info);
        return albums;
    }


    /**
     * Get albums amount of an artist, the artistId must be number string
     */
    public async artistAlbumCount(artistId: string): Promise<number> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.artistAlbums,
            {
                artistId: artistId,
                pagingVO: {
                    page: 1,
                    pageSize: 1,
                }
            },
            `http://h.xiami.com/artist_detail.html?id=${artistId}&f=&from=&ch=`,
        );

        return json.data.data.total;
    }


    /**
     * Get songs of an artist, the artistId must be number string
     */
    public async artistSongs(artistId: string, page: number = 1, size: number = 10): Promise<Array<ISong>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.artistSongs,
            {
                artistId: artistId,
                backwardOffSale: true,
                pagingVO: {
                    page: page,
                    pageSize: size,
                }
            },
            `http://h.xiami.com/artist_detail.html?id=${artistId}&f=&from=&ch=`,
        );

        let info = json.data.data.songs;
        let songs = makeAliSongs(info);
        return songs;
    }


    /**
     * Get songs amount of an artist, the artistId must be number string
     */
    public async artistSongCount(artistId: string): Promise<number> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.artistSongs,
            {
                artistId: artistId,
                backwardOffSale: true,
                pagingVO: {
                    page: 1,
                    pageSize: 1,
                }
            },
            `http://h.xiami.com/artist_detail.html?id=${artistId}&f=&from=&ch=`,
        );

        return json.data.data.total;
    }


    /**
     * Get similar artists of the artist, the artistId must be number string
     */
    public async similarArtists(artistId: string, page: number = 1, size: number = 10): Promise<Array<IArtist>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.similarArtists,
            {
                artistId: artistId,
                pagingVO: {
                    page: page,
                    pageSize: size,
                }
            },
            `http://h.xiami.com/artist_detail.html?id=${artistId}&f=&from=&ch=`,
        );

        let info = json.data.data.artists;
        let artists = makeAliArtists(info);
        return artists;
    }


    /**
     * How many similar artists has the artist, the artistId must be number string
     */
    public async similarArtistCount(artistId: string): Promise<number> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.similarArtists,
            {
                artistId: artistId,
                pagingVO: {
                    page: 1,
                    pageSize: 1,
                }
            },
            `http://h.xiami.com/artist_detail.html?id=${artistId}&f=&from=&ch=`,
        );

        return json.data.data.pagingVO.count;
    }


    /**
     * Get a collection, the collectionId must be number string
     */
    public async collection(collectionId: string): Promise<ICollection> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.collection,
            {
                listId: collectionId,
                isFullTags: false,
            },
            `http://h.xiami.com/collect_detail.html?id=${collectionId}&f=&from=&ch=`,
        );

        let info = json.data.data.collectDetail;
        let collection = makeAliCollection(info);
        return collection;
    }


    /**
     * TODO, parser is need
     */
    public async collections(keyword: string, type: string = 'new', page: number = 1, size: number = 10): Promise<Array<ICollection>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.collections,
            {
                custom: 0,
                // dataType: 'new', ''
                dataType: type,
                info: 1,
                key: keyword,
                pagingVO: {
                    page: page,
                    pageSize: size,
                }
            },
        );
        let info = json.data.data.collects;
        let collections = makeAliCollections(info);
        return collections;
    }


    /**
     * Search Songs
     *
     * XXX Cookies must include 'uidXM=${userId}'
     */
    public async searchSongs(keyword: string, page: number = 1, size: number = 10): Promise<Array<ISong>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.searchSongs,
            {
                key: keyword,
                pagingVO: {
                    page: page,
                    pageSize: size,
                }
            },
        );
        let info = json.data.data.songs;
        let songs = makeAliSongs(info);
        return songs;
    }


    /**
     * Search albums
     *
     * XXX Cookies must include 'uidXM=${userId}'
     */
    public async searchAlbums(keyword: string, page: number = 1, size: number = 10): Promise<Array<IAlbum>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.searchAlbums,
            {
                // isRecommendCorrection: false,
                // isTouFu: true,
                key: keyword,
                pagingVO: {
                    page: page,
                    pageSize: size,
                }
            },
        );
        let info = json.data.data.albums;
        let albums = makeAliAlbums(info);
        return albums;
    }


    public async searchArtists(keyword: string, page: number = 1, size: number = 10): Promise<Array<IArtist>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.searchArtists,
            {
                key: keyword,
                pagingVO: {
                    page: page,
                    pageSize: size,
                }
            },
        );
        let info = json.data.data.artists;
        let artists = makeAliArtists(info);
        return artists;
    }


    public async searchCollections(keyword: string, page: number = 1, size: number = 10): Promise<Array<ICollection>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.searchCollections,
            {
                key: keyword,
                pagingVO: {
                    page: page,
                    pageSize: size,
                }
            },
        );
        let info = json.data.data.collects;
        let collections = makeAliCollections(info);
        return collections;
    }


    /**
     * TODO, parser is need
     */
    public async hotTags(): Promise<any> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.hotTags,
            {},
        );
        return json;
    }


    /**
     * TODO, parser is need
     */
    public async recommandTags(): Promise<any> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.recommandTags,
            { from: 'homeattic' },
        );
        return json;
    }


    public async login(account: string, password: string): Promise<any> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.login,
            {
                account,
                password: md5(password),
            },
            `http://h.xiami.com/`,
        );

        /**
         * accessToken: string
         * expires: number
         * nickName: string
         * refreshExpires: number
         * refreshToken: string
         * schemeUrl: string
         * userId: number
         */
        return json.data.data;
    }


    public setAccessToken(accessToken: string, refreshToken?: string): void {
        AliMusicApi.accessToken = accessToken;
        AliMusicApi.refreshToken = refreshToken;
    }


    /**
     * userId is a number string
     */
    public setUserId(userId: string): void {
        AliMusicApi.userId = userId;
    }


    /**
     * XXX need to parse
     */
    public async userInfo(userId?: string): Promise<any> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.userInfo,
            userId ? { userId: parseInt(userId) } : {},
        );
        return json;
    }


    protected async userFavorites(userId: string, type: number, page: number = 1, size: number = 10): Promise<any> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.userFavorites,
            {
                full: false,
                type: type, // song: 1, album: 2, artist: 3, collection: 5
                userId: parseInt(userId),
                pagingVO: {
                    page: page,
                    pageSize: size,
                },
            },
        );
        return json;
    }


    public async userFavoriteSongs(userId: string, page: number = 1, size: number = 10): Promise<Array<ISong>> {
        let json = await this.userFavorites(userId, 1, page, size);
        let info = json.data.data.songs;
        let songs = makeAliSongs(info);
        return songs;
    }


    public async userFavoriteAlbums(userId: string, page: number = 1, size: number = 10): Promise<Array<IAlbum>> {
        let json = await this.userFavorites(userId, 2, page, size);
        let info = json.data.data.albums;
        let albums = makeAliAlbums(info);
        return albums;
    }


    public async userFavoriteArtists(userId: string, page: number = 1, size: number = 10): Promise<Array<IArtist>> {
        let json = await this.userFavorites(userId, 3, page, size);
        let info = json.data.data.artists;
        let artists = makeAliArtists(info);
        return artists;
    }


    public async userFavoriteCollections(userId: string, page: number = 1, size: number = 10): Promise<Array<ICollection>> {
        let json = await this.userFavorites(userId, 5, page, size);
        let info = json.data.data.collects;
        let collections = makeAliCollections(info);
        return collections;
    }
}


let aliMusicApi = new AliMusicApi();
aliMusicApi.setUserId('1');

let xiamiApi = new XiamiApi();

// Global Xiami Api objects
export { aliMusicApi, xiamiApi };
