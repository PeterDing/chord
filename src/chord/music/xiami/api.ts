'use strict';

import { Logger, LogLevel } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';
const loggerWarning = new Logger(filenameToNodeName(__filename), LogLevel.Warning);

import { ok } from 'chord/base/common/assert';
import { assign } from 'chord/base/common/objects';
import { md5 } from 'chord/base/node/crypto';
import { getRandomInt } from 'chord/base/node/random';

import { Cookie, makeCookieJar, makeCookie, makeCookies } from 'chord/base/node/cookies';
import { querystringify } from 'chord/base/node/url';
import { request, IRequestOptions, htmlGet } from 'chord/base/node/_request';

import { ORIGIN } from 'chord/music/common/origin';

import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { ILyric } from 'chord/music/api/lyric';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IListOption } from 'chord/music/api/listOption';

import { IUserProfile, IAccount } from 'chord/music/api/user';

import { ESize, resizeImageUrl } from 'chord/music/common/size';

import {
    makeSong,
    makeAlbum,
    makeArtist,
    makeCollection,

    makeAliSong,
    makeAliLyric,
    makeAliSongs,
    makeAliAlbum,
    makeAliAlbums,
    makeAliArtist,
    makeAliArtists,
    makeAliCollection,
    makeAliCollections,

    makeUserProfile,
    makeUserProfiles,
    makeUserProfileMore,
    makeAccount,
} from "chord/music/xiami/parser";


const DOMAIN = 'xiami.com';

const UIDXM = 'uidXM';
const CNA = 'cna';


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
    static readonly PLATFORM_ID = 'h5';
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

        recommendTags: 'mtop.alimusic.music.list.collectservice.getrecommendtags',
        hotTags: 'mtop.alimusic.music.list.collectservice.gethottags',

        // searchSongs: XXX Cookies must include 'uidXM=${userId}'
        searchSongs: 'mtop.alimusic.search.searchservice.searchsongs',

        // searchAlbums: XXX Cookies must include 'uidXM=${userId}'
        searchAlbums: 'mtop.alimusic.search.searchservice.searchalbums',
        searchArtists: 'mtop.alimusic.search.searchservice.searchartists',
        searchCollections: 'mtop.alimusic.search.searchservice.searchcollects',

        // AI recommends songs
        radioSongs: 'mtop.alimusic.music.radio.getradiosongs',

        newSongs: '',
        newAlbums: 'mtop.alimusic.recommend.albumservice.getmusiclist',
        newCollections: '',

        songList: 'mtop.alimusic.recommend.songservice.gethotsongs',
        albumList: 'mtop.alimusic.recommend.albumservice.getmusiclist',

        login: 'mtop.alimusic.xuser.facade.xiamiuserservice.login',
        userProfile: 'mtop.alimusic.xuser.facade.xiamiuserservice.getuserinfobyuserid',
        userProfileMore: 'mtop.alimusic.xuser.facade.homepageservice.getuserhomeinfo',
        userFavorites: 'mtop.alimusic.fav.favoriteservice.getfavorites',
        userCreatedCollections: 'mtop.alimusic.music.list.collectservice.getcollectbyuser',
        // userRecentPlay: 'mtop.alimusic.playlog.facade.playlogservice.getrecentplaylog',
        userRecentPlay: 'mtop.alimusic.playlog.facade.playlogservice.getrecentsongplaylog',
        userFollowings: 'mtop.alimusic.social.friendservice.getfollows',

        // no privilege for some users
        userFollowers: 'mtop.alimusic.social.friendservice.getfans',

        userLikeSong: 'mtop.alimusic.fav.songfavoriteservice.favoritesong',
        userLikeAlbum: 'mtop.alimusic.fav.albumfavoriteservice.favoritealbum',
        userLikeArtist: 'mtop.alimusic.fav.artistfavoriteservice.favoriteartist',
        userLikeCollection: 'mtop.alimusic.fav.collectfavoriteservice.favoritecollect',
        userLikeUserProfile: 'mtop.alimusic.social.friendservice.addfollow',

        userDislikeSong: 'mtop.alimusic.fav.songfavoriteservice.unfavoritesong',
        userDislikeAlbum: 'mtop.alimusic.fav.albumfavoriteservice.unfavoritealbum',
        userDislikeArtist: 'mtop.alimusic.fav.artistfavoriteservice.unfavoriteartist',
        userDislikeCollection: 'mtop.alimusic.fav.collectfavoriteservice.unfavoritecollect',
        userDislikeUserProfile: 'mtop.alimusic.social.friendservice.unfollow',

        // recommend songs for user logined
        recommendSongs: 'mtop.alimusic.recommend.songservice.getdailysongs',

        recommendAlbums: 'mtop.alimusic.music.recommendservice.getrecommendalbums',

        // Recommend collections by user's favorite collections
        recommendCollections: 'mtop.alimusic.music.recommendservice.getrecommendcollects',

        playLog: 'mtop.alimusic.playlog.facade.playlogservice.addplaylog',
    }

    // account
    private account: IAccount;
    private token: string;
    private cookies: { [key: string]: Cookie; } = {};

    // For user authority
    private userId: string;
    private accessToken: string;
    private refreshToken: string;


    constructor() {
        this.userId = '1';

        // Get cna
        this.getEtag().then((etag) => {
            this.setEtagCookie(etag);
        });
    }


    public reset() {
        this.token = null;
        this.cookies = {};
    }


    public static makeCookie(key: string, value: string): Cookie {
        let domain = DOMAIN;
        return makeCookie(key, value, domain);
    }


    public makeQueryStr(params: object): string {
        let header = {
            platformId: AliMusicApi.PLATFORM_ID,
            callId: Date.now(),
            appVersion: 1000000,
            resolution: '2560x1440',
            appId: 200,
            openId: 0,
        };
        if (this.accessToken) {
            header = assign({}, header, { accessToken: this.accessToken });
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
        let token = this.token || 'undefined';
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
        if (this.token) {
            return null;
        }

        // userId is needed to anti-creep
        if (this.userId) {
            this.setUserIdCookie();
        }

        return this.request(
            AliMusicApi.NODE_MAP.album,
            { albumId: '1' },
            'http://h.xiami.com/album_detail.html?id=1&f=&from=&ch=',
            true,
        );
    }


    public setUserIdCookie(userId?: string): void {
        userId = userId || this.userId;

        ok(userId, 'no userId');

        let key = 'uidXM';
        let value = userId;
        let cookie = AliMusicApi.makeCookie(key, value);

        this.cookies['uidXM'] = cookie;
    }


    /**
     * Etag for anti spider
     */
    public async getEtag(): Promise<string> {
        let url = 'http://log.mmstat.com/eg.js';
        let options: IRequestOptions = {
            method: 'GET',
            url: url,
            headers: { ...AliMusicApi.HEADERS },
            gzip: true,
            resolveWithFullResponse: true,
        };
        let result: any = await request(options);
        return result.headers['etag'];
    }


    public setEtagCookie(etag: string): void {
        let key = 'cna';
        let value = etag;
        let cookie = AliMusicApi.makeCookie(key, value);

        this.cookies['cna'] = cookie;
    }


    /**
     * If init is true, request returns response, NOT json
     */
    public async request(node: string, apiParams: object, referer?: string, init: boolean = false, excludedCookies: Array<string> = []): Promise<any | null> {
        if (!init) {
            await this.getToken();
        }

        // set random use id for anti-spider
        this.setUserIdCookie(getRandomInt(1, 30000000).toString());

        let url = AliMusicApi.BASICURL + node + '/' + AliMusicApi.VERSION + '/';
        let queryStr = this.makeQueryStr(apiParams);
        let time = Date.now();
        let sign = this.makeSign(queryStr, time);
        let params = this.makeParamstr(time, sign, queryStr, node);

        let headers = !!referer ? { ...AliMusicApi.HEADERS, Referer: referer } : { ...AliMusicApi.HEADERS };

        // Make cookie jar
        let cookieJar = makeCookieJar();
        let cookies = { ...this.cookies };
        excludedCookies.forEach(key => { delete cookies[key]; });
        for (let key in cookies) {
            cookieJar.setCookie(cookies[key], 'http://' + DOMAIN);
        }

        url = url + '?' + params;
        let options: IRequestOptions = {
            method: 'GET',
            url: url,
            // Cookies is excepted to get token
            jar: !init ? cookieJar : null,
            headers: headers,
            gzip: true,
            resolveWithFullResponse: init,
        };
        let result: any = await request(options);
        if (init && result.headers.hasOwnProperty('set-cookie')) {
            makeCookies(result.headers['set-cookie']).forEach(cookie => {
                this.cookies[cookie.key] = cookie;
                if (cookie.key == '_m_h5_tk') {
                    this.token = cookie.value.split('_')[0];
                }
            });
            return null;
        }
        let json = JSON.parse(result.trim().slice(11, -1));

        // TODO: Handle each errors
        if (json.ret[0].search('SUCCESS') == -1) {
            loggerWarning.warning('[AliMusicApi.request] [Error]: (params, response):', options, json);
        }

        // FAIL_SYS_TOKEN_EXOIRED::令牌过期
        if (json.ret && json.ret[0].search('FAIL_SYS_TOKEN_EXOIRED') != -1) {
            loggerWarning.warning('AliMusicApi: TOKEN_EXOIRED');
            this.reset();
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


    public async lyric(songId: string, song?: ISong): Promise<ILyric> {
        let lyricUrl;
        if (!song || !song.lyricUrl) {
            song = await this.song(songId);
        }
        lyricUrl = song.lyricUrl;
        if (!lyricUrl) return null;

        let cn: any = await htmlGet(lyricUrl);
        return makeAliLyric(songId, cn);
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
            false,
            [UIDXM],
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
     * Search Songs
     *
     * XXX Cookies must include 'uidXM=${userId}'
     */
    public async searchSongs(keyword: string, page: number = 1, size: number = 10): Promise<Array<ISong>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.searchSongs,
            {
                key: keyword.replace(/\s+/g, '+'),
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
                key: keyword.replace(/\s+/g, '+'),
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
                key: keyword.replace(/\s+/g, '+'),
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
                key: keyword.replace(/\s+/g, '+'),
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
     * radioId:
     *     1 - 猜你喜欢
     *     0 - 听见不同
     *     7 - 私人电台
     */
    public async radioSongs(radioId: string, size: number = 10): Promise<Array<ISong>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.radioSongs,
            {
                extraId: 0,
                limit: size,
                radioType: radioId,
            },
        );
        let info = json.data.data.songs;
        let songs = makeAliSongs(info);
        return songs;
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
    public async recommendTags(): Promise<any> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.recommendTags,
            { from: 'homeattic' },
        );
        return json.data.data.recommendTags;
    }


    /**
     * Get new songs
     *
     * languageId:
     *     5:  推荐
     *     10: 华语
     *     12: 欧美
     *     13: 韩国
     *     14: 日本
     */
    public async songList(languageId: number = 5, page: number = 1, size: number = 10): Promise<Array<ISong>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.songList,
            {
                language: languageId.toString(),
                pagingVO: {
                    page,
                    pageSize: size,
                },
            },
        );
        let info = json.data.data.songs;
        return makeAliSongs(info);
    }


    public async albumListOptions(): Promise<Array<IListOption>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.newAlbums,
            {
                bizCode: 'album',
                filter: '{}',
                pagingVO: {
                    page: 1,
                    pageSize: 1,
                },
            },
        );
        let orders: IListOption = {
            name: '排序',
            type: 'order',
            items: [
                { id: 0, name: '推荐' },
                { id: 1, name: '最新' },
                { id: 2, name: '最热' },
            ],
        }
        return [...json.data.data.label, orders];
    }


    /**
     * Select Albums
     *
     * order:
     *     0 or undefined: 推荐
     *     1: 最新
     *     2: 最热
     *
     * language: 语种
     * tag: 曲风
     * century: 年代
     * category: 分类
     */
    public async albumList(
        order: number = 0,
        languageId: number = 0,
        tagId: number = 0,
        centuryId: number = 0,
        categoryId: number = 0,
        page: number = 1,
        size: number = 10): Promise<Array<IAlbum>> {

        let json = await this.request(
            AliMusicApi.NODE_MAP.albumList,
            {
                bizCode: 'album',
                filter: JSON.stringify({
                    order: order || undefined,
                    language: languageId || undefined,
                    tag: tagId || undefined,
                    century: centuryId || undefined,
                    category: categoryId || undefined,
                }),
                pagingVO: {
                    page,
                    pageSize: size,
                },
            },
        );
        let info = json.data.data.albums;
        return makeAliAlbums(info);
    }


    /**
     * Get collections by type
     *
     * types:
     *     'system' - 推荐
     *     'recommend' - 精选
     *     'hot' - 最热
     *     'new' - 最新
     */
    public async collectionList(
        keyword: string,
        type: string = 'new',
        page: number = 1,
        size: number = 10): Promise<Array<ICollection>> {

        let json = await this.request(
            AliMusicApi.NODE_MAP.collections,
            {
                custom: 0,
                dataType: type,
                info: 1,
                key: keyword ? keyword.replace(/\s+/g, '+') : undefined,
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


    public async newSongs(page: number = 1, size: number = 10): Promise<Array<ISong>> {
        return this.songList(5, page, size);
    }


    /**
     * Get new albums
     *
     * The minimum return albums size are 5
     */
    public async newAlbums(page: number = 1, size: number = 10): Promise<Array<IAlbum>> {
        return this.albumList(0, 0, 0, 0, 0, page, size);
    }


    public async newCollections(page: number = 1, size: number = 10): Promise<Array<ICollection>> {
        return this.collectionList(undefined, 'new', page, size);
    }


    public async login(accountName: string, password: string): Promise<IAccount> {
        // Create a new AliMusicApi instance to handle login
        let tmpApi = new AliMusicApi();

        let json = await tmpApi.request(
            AliMusicApi.NODE_MAP.login,
            {
                account: accountName,
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

        let info = json.data.data;
        let account = makeAccount(info);
        let userProfile = await this.userProfile(account.user.userOriginalId);
        account.user.userAvatarUrl = userProfile.userAvatarUrl;
        return account;
    }


    /**
     * WARN !! This is only way of setting an account to an AliMusicApi instance
     */
    public setAccount(account: IAccount): void {
        ok(account.user.origin == ORIGIN.xiami, `[AliMusicApi.setAccount]: this account is not a xiami account`);

        this.setAccessToken(account.accessToken, account.refreshToken);
        this.setUserId(account.user.userOriginalId);

        this.account = account;
    }


    public getAccount(): IAccount {
        return this.account;
    }


    public setAccessToken(accessToken: string, refreshToken?: string): void {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }


    /**
     * here, the userId is IUserProfile.userOriginalId, as followings
     */
    public setUserId(userId: string): void {
        this.userId = userId;
    }


    public logined(): boolean {
        return !!this.account && !!this.account.accessToken;
    }


    /**
     * here, the userId is IUserProfile.userOriginalId
     */
    public async userProfile(userId: string): Promise<IUserProfile> {
        let req = this.request(
            AliMusicApi.NODE_MAP.userProfile,
            { userId: parseInt(userId) },
        );
        let [json, userProfileMore] = await Promise.all([req, this.userProfileMore(userId)]);
        let userProfile = makeUserProfile(json.data.data);
        let _up = { ...userProfile, ...userProfileMore };
        _up.userId = userProfile.userId;
        return _up;
    }


    /**
     * here, the userId is IUserProfile.userOriginalId
     */
    public async userProfileMore(userId: string): Promise<IUserProfile> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.userProfileMore,
            { userId: parseInt(userId) },
        );
        return makeUserProfileMore(json.data.data);
    }


    /**
     * here, the userId is IUserProfile.userOriginalId
     */
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


    /**
     * here, the userId is IUserProfile.userOriginalId
     */
    public async userFavoriteSongs(userId: string, page: number = 1, size: number = 10): Promise<Array<ISong>> {
        let json = await this.userFavorites(userId, 1, page, size);
        let info = json.data.data.songs;
        let songs = makeAliSongs(info);
        return songs;
    }


    /**
     * here, the userId is IUserProfile.userOriginalId
     */
    public async userFavoriteAlbums(userId: string, page: number = 1, size: number = 10): Promise<Array<IAlbum>> {
        let json = await this.userFavorites(userId, 2, page, size);
        let info = json.data.data.albums;
        let albums = makeAliAlbums(info);
        return albums;
    }


    /**
     * here, the userId is IUserProfile.userOriginalId
     */
    public async userFavoriteArtists(userId: string, page: number = 1, size: number = 10): Promise<Array<IArtist>> {
        let json = await this.userFavorites(userId, 3, page, size);
        let info = json.data.data.artists;
        let artists = makeAliArtists(info);
        return artists;
    }


    /**
     * here, the userId is IUserProfile.userOriginalId
     */
    public async userFavoriteCollections(userId: string, page: number = 1, size: number = 10): Promise<Array<ICollection>> {
        let json = await this.userFavorites(userId, 5, page, size);
        let info = json.data.data.collects;
        let collections = makeAliCollections(info);
        return collections;
    }


    /**
     * here, the userId is IUserProfile.userOriginalId
     */
    public async userCreatedCollections(userId: string, page: number = 1, size: number = 10): Promise<Array<ICollection>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.userCreatedCollections,
            {
                userId,
                hideSystemSonglistCover: 1,
                includeSystemCreate: 1,
                sort: 0,
                pagingVO: {
                    page: page,
                    pageSize: size,
                },
            },
        );
        let info = json.data.data.collects;
        let collections = makeAliCollections(info);
        let userName = collections.length ? collections[0].userName : null;
        if (!userName) {
            let userProfile = await this.userProfile(userId);
            userName = userProfile.userName;
        }
        collections.forEach(collection => collection.userName = userName);
        return collections;
    }


    /**
     * here, the userId is IUserProfile.userOriginalId
     */
    public async userRecentPlay(userId: string, page: number = 1, size: number = 10): Promise<Array<ISong>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.userRecentPlay,
            // {
            // objectType: 'song',
            // },
            {
                userId,
                fullView: 1,
                pagingVO: {
                    page: page,
                    pageSize: size,
                },
            },
        );
        let info = json.data.data.songs;
        let songs = makeAliSongs(info);
        return songs;
    }


    /**
     * here, the userId is IUserProfile.userOriginalId
     */
    public async userFollowings(userId: string, page: number = 1, size: number = 10): Promise<Array<IUserProfile>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.userFollowings,
            {
                userId,
                pagingVO: {
                    page: page,
                    pageSize: size,
                },
            },
        );
        let info = json.data.data.friendVOList;
        return makeUserProfiles(info);
    }


    /**
     * here, the userId is IUserProfile.userOriginalId
     */
    public async userFollowers(userId: string, page: number = 1, size: number = 10): Promise<Array<IUserProfile>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.userFollowers,
            {
                userId,
                pagingVO: {
                    page: page,
                    pageSize: size,
                },
            },
        );
        let info = json.data.data.friendVOList;
        return makeUserProfiles(info);
    }


    /**
     * songId is ISong.songOriginalId, as following
     */
    public async userLikeSong(songId: string): Promise<boolean> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.userLikeSong,
            {
                songId,
            },
        );
        return json.data.data.status;
    }


    public async userLikeAlbum(albumId: string): Promise<boolean> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.userLikeAlbum,
            {
                albumId,
            },
        );
        return json.data.data.status;
    }


    public async userLikeArtist(artistId: string): Promise<boolean> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.userLikeArtist,
            {
                artistId,
            },
        );
        return json.data.data.status;
    }


    public async userLikeCollection(collectionId: string): Promise<boolean> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.userLikeCollection,
            {
                collectId: collectionId,
            },
        );
        return json.data.data.status;
    }


    public async userLikeUserProfile(userId: string): Promise<boolean> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.userLikeUserProfile,
            {
                toUserId: userId,
            },
        );
        return json.data.data.toUserId == userId;
    }


    public async userDislikeSong(songId: string): Promise<boolean> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.userDislikeSong,
            {
                songId,
            },
        );
        return json.data.data.status;
    }


    public async userDislikeAlbum(albumId: string): Promise<boolean> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.userDislikeAlbum,
            {
                albumId,
            },
        );
        return json.data.data.status;
    }


    public async userDislikeArtist(artistId: string): Promise<boolean> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.userDislikeArtist,
            {
                artistId,
            },
        );
        return json.data.data.status;
    }


    public async userDislikeCollection(collectionId: string): Promise<boolean> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.userDislikeCollection,
            {
                collectId: collectionId,
            },
        );
        return json.data.data.status;
    }


    public async userDislikeUserProfile(userId: string): Promise<boolean> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.userDislikeUserProfile,
            {
                toUserId: userId,
            },
        );
        return json.data.data.status;
    }


    public async recommendSongs(page: number = 1, size: number = 10): Promise<Array<ISong>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.recommendSongs,
            {
                // no params needed
            },
        );
        let info = json.data.data.songs;
        let songs = makeAliSongs(info);
        return songs;
    }


    /**
     * Recommend collections related through user's favorite collections
     */
    public async recommendCollections(page: number = 1, size: number = 10): Promise<Array<ICollection>> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.recommendCollections,
            {
                recommendType: 'favorite',
            },
        );
        return makeAliCollections(json.data.data.list);
    }


    /**
     * Record played song
     */
    public async playLog(songId: string, seek: number): Promise<boolean> {
        let json = await this.request(
            AliMusicApi.NODE_MAP.playLog,
            {
                collectId: 0,
                latitude: 0,
                longitude: 0,
                songId: parseInt(songId),
                startPoint: 120,
                time: Date.now(),
                type: 8,
                userId: 0,
            },
        );
        return json.data.data.status;
    }


    public resizeImageUrl(url: string, size: ESize | number): string {
        return resizeImageUrl(url, size, (url, size) => `${url}?x-oss-process=image/resize,m_fill,w_${size},h_${size}/format,webp`);
    }
}
