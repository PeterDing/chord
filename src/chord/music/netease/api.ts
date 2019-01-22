'use strict';

import { ok } from 'chord/base/common/assert';
import { md5 } from 'chord/base/node/crypto';

import { jsonDumpValue } from 'chord/base/common/json';

import { ORIGIN } from 'chord/music/common/origin';

import { NoLoginError, ServerError } from 'chord/music/common/errors';

import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { ILyric } from 'chord/music/api/lyric';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IListOption } from 'chord/music/api/listOption';

import { IUserProfile, IAccount } from 'chord/music/api/user';

import { ESize, resizeImageUrl } from 'chord/music/common/size';

import { makeCookieJar, makeCookieFrom, makeCookie, CookieJar } from 'chord/base/node/cookies';
import { request, IRequestOptions } from 'chord/base/node/_request';

import { encrypt } from 'chord/music/netease/crypto';
import { initiateCookies } from 'chord/music/netease/util';

import {
    makeAudio,
    makeSong,
    makeSongs,
    makeLyric,
    makeAlbum,
    makeAlbums,
    makeCollection,
    makeCollections,
    makeArtist,
    makeArtists,
    makeArtistAlbums,

    makeUserProfile,
    getInfosFromHtml,
    makeUserProfiles,
    // makeAccount,
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
        audio: 'weapi/song/enhance/player/url',
        song: 'weapi/v3/song/detail',
        lyric: 'weapi/song/lyric',
        album: 'weapi/v1/album',
        collection: 'weapi/v3/playlist/detail',

        artist: 'weapi/v1/artist',
        artistSongs: 'weapi/v1/artist',
        artistAlbums: 'weapi/artist/albums',

        search: 'weapi/search/get',

        similarSongs: 'weapi/v1/discovery/simiSong',
        similarArtists: 'weapi/discovery/simiArtist',
        similarCollections: 'weapi/discovery/simiPlaylist',

        collectionListOptions: 'weapi/playlist/catalogue',
        collectionList: 'weapi/playlist/list',

        newSongs: 'weapi/v1/discovery/new/songs',
        newAlbums: 'weapi/album/new',
        newCollections: 'weapi/playlist/list',

        login: 'weapi/login',
        loginRefresh: 'weapi/login/token/refresh',

        userProfile: 'weapi/share/userprofile/info',

        userFavoriteArtists: 'weapi/artist/sublist',
        userFavoriteCollections: 'weapi/user/playlist',
        userFollowings: 'weapi/user/getfollows/',
        userFollowers: 'weapi/user/getfolloweds',

        userLikeSong: 'weapi/playlist/manipulate/tracks',
        createCollection: 'weapi/playlist/create',
        userLikeArtist: 'weapi/artist/sub',
        userLikeCollection: 'weapi/playlist/subscribe',
        userLikeUserProfile: 'weapi/user/follow/',

        userDislikeArtist: 'weapi/artist/unsub',
        userDislikeCollection: 'weapi/playlist/unsubscribe',
        userDislikeUserProfile: 'weapi/user/delfollow/',

        recommendNewSongs: 'weapi/personalized/newsong',
        recommendSongs: 'weapi/v1/discovery/recommend/songs',
        recommendDailyCollections: 'weapi/v1/discovery/recommend/resource',
        recommendCollections: 'weapi/personalized/playlist',

        playLog: 'weapi/feedback/weblog',
    }

    private account: IAccount;
    private cookieJar: CookieJar;


    constructor() {
        if (!this.cookieJar) {
            let cookieJar = makeCookieJar();
            initiateCookies().forEach(cookie => {
                let domain = cookie.domain;
                cookieJar.setCookie(cookie, domain.startsWith('http') ? domain : 'http://' + domain);
            });
            this.cookieJar = cookieJar;
        }
    }


    public async request(node: string, data: any, init: boolean = false, retry: number = 0): Promise<any> {
        let url = NeteaseMusicApi.BASICURL + node;

        let options: IRequestOptions = {
            method: 'POST',
            url: url,
            jar: this.cookieJar || null,
            headers: NeteaseMusicApi.HEADERS,
            form: encrypt(jsonDumpValue(data)),
            gzip: true,
            json: true,
            resolveWithFullResponse: init,
        };

        let result = await request(options);

        // retry
        if (!result && retry < MAX_RETRY) return this.request(node, data, init, retry + 1);

        ok(result, `[ERROR] [NeteaseMusicApi.request]: url: ${url}, result is ${result}`);

        let resultCode = init ? result.body['code'] : result['code'];
        ok(resultCode == 200, `[ERROR] [NeteaseMusicApi.request]: url: ${url}, result.code is ${resultCode}, result is ${JSON.stringify(result)}`);
        return result;
    }


    /**
     * to get directly link (128kbps)
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
        return makeSong(json['songs'][0], json['privileges'][0]);
    }


    public async lyric(songId: string): Promise<ILyric> {
        let node = NeteaseMusicApi.NODE_MAP.lyric;
        let data = {
            csrf_token: "",
            id: songId,
            lv: -1,
            tv: -1,
        };
        let json = await this.request(node, data);
        let lyricInfo = json['lrc'] ? json['lrc']['lyric'] : null;
        let transInfo = json['tlyric'] ? json['tlyric']['lyric'] : null;
        return makeLyric(songId, lyricInfo, transInfo);
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


    public async collection(collectionId: string, size: number = 10000): Promise<ICollection> {
        let node = NeteaseMusicApi.NODE_MAP.collection;
        let data = {
            id: collectionId,
            total: true,
            // offset: offset,  // offset, limit do not support
            // limit: limit,
            n: size,
            csrf_token: '',
        };
        let json = await this.request(node, data);
        return makeCollection(json['playlist'], json['privileges']);
    }


    /**
     * Search
     *
     * data params:
     * @type:
     * 1: 单曲
     * 10: 专辑
     * 100: 歌手
     * 1000: 歌单
     * 1002: 用
     * 1004: M
     * 1006: 歌
     * 1009: 电
     * 1014: 视频
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
        if (!json['result']) { return []; }
        return makeSongs(json['result']['songs'] || []);
    }


    /**
     * Search albums
     * type = 10
     */
    public async searchAlbums(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let json = await this.search(10, keyword, offset, limit);
        if (!json['result']) { return []; }
        return makeAlbums(json['result']['albums'] || []);
    }


    /**
     * Search artists
     *
     * type = 100
     */
    public async searchArtists(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IArtist>> {
        let json = await this.search(100, keyword, offset, limit);
        if (!json['result']) { return []; }
        return makeArtists(json['result']['artists'] || []);
    }


    /**
     * Search collections
     * type = 1000
     */
    public async searchCollections(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let json = await this.search(1000, keyword, offset, limit);
        if (!json['result']) { return []; }
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


    public async collectionListOptions(): Promise<Array<IListOption>> {
        let node = NeteaseMusicApi.NODE_MAP.collectionListOptions;
        let data = {};
        let json = await this.request(node, data);
        let categories = json['categories'];
        let options = [];
        let _all = {
            type: 'cat',
            name: '全部歌单',
            items: [{ id: '全部', name: '全部' }],
        };
        options.push(_all);
        Object.keys(categories).forEach(id => {
            let option = {
                type: 'cat',
                name: categories[id],
                items: json['sub']
                    .filter(info => info['category'].toString() == id)
                    .map(info => ({
                        id: info['name'],
                        name: info['name'],
                    })),
            };
            options.push(option);
        });
        let orders = {
            type: 'order',
            name: '全部歌单',
            items: [
                { id: 'hot', name: '最热' },
                { id: 'new', name: '最新' },
            ],
        };
        options.push(orders);
        return options;
    }


    /**
     * order:
     *     hot
     *     new
     */
    public async collectionList(cat: string, order: string = 'hot', offset: number = 1, limit: number = 10): Promise<Array<ICollection>> {
        let node = NeteaseMusicApi.NODE_MAP.collectionList;
        let data = {
            cat,
            order,
            offset,
            limit,
            total: true,
        };
        let json = await this.request(node, data);
        return makeCollections(json['playlists']);
    }


    /**
     * Get new songs
     *
     * Here, offset, limit are not functional
     */
    public async newSongs(offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let node = NeteaseMusicApi.NODE_MAP.newSongs;
        let data = {
            areaId: 0,   // 全部: 0, 华语: 7, 欧美: 96, 日本: 8, 韩国: 16
            // limit: limit, 
            // offset: offset,
            total: true,
        };
        let json = await this.request(node, data);
        return makeSongs(json['data'] || []);
    }


    public async newAlbums(offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let node = NeteaseMusicApi.NODE_MAP.newAlbums;
        let data = {
            area: 'ALL',    // ALL, ZH, EA, KR, JP
            limit: limit,
            offset: offset,
            total: true,
        };
        let json = await this.request(node, data);
        return makeAlbums(json['albums'] || []);
    }


    public async newCollections(offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let node = NeteaseMusicApi.NODE_MAP.newCollections;
        let data = {
            cat: '全部',  // see `this.collections`
            order: 'new', // hot,new
            limit: limit,
            offset: offset,
            total: true,
        };
        let json = await this.request(node, data);
        return makeCollections(json['playlists'] || []);
    }


    public async login(accountName: string, password: string): Promise<IAccount> {
        let tmpApi = new NeteaseMusicApi();

        let node = NeteaseMusicApi.NODE_MAP.login;
        let data = {
            username: accountName,
            password: md5(password),
            rememberLogin: 'true',
        };
        let result = await tmpApi.request(node, data, true);

        // set user cookies
        // XXX: '__csrf' may be not needed
        let cookies = {};
        result.headers['set-cookie'].forEach(cookieStr => {
            let cookie = makeCookieFrom(cookieStr);
            cookies[cookie.key] = cookie.value;
        });

        let user = makeUserProfile(result.body.profile);

        let account = {
            user,
            cookies,
            type: 'account',
        };

        return account;
    }


    public setAccount(account: IAccount): void {
        ok(account.user.origin == ORIGIN.netease, `[NeteaseMusicApi.setAccount]: this account is not a netease account`);

        let domain = 'music.163.com';

        Object.keys(account.cookies).forEach(key => {
            let cookie = makeCookie(key, account.cookies[key], domain);
            this.cookieJar.setCookie(cookie, domain.startsWith('http') ? domain : 'http://' + domain);
        });

        // For createCollection
        let cookie = makeCookie('os', 'pc', domain);
        this.cookieJar.setCookie(cookie, domain.startsWith('http') ? domain : 'http://' + domain);

        this.account = account;
    }


    public getAccount(): IAccount {
        return this.account;
    }


    public logined(): boolean {
        return !!this.account && !!this.account.cookies && !!this.account.cookies['MUSIC_U'];
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
     * here, the userId is IUserProfile.userOriginalId, as followings
     */
    public async userProfile(userId: string): Promise<IUserProfile> {
        let node = NeteaseMusicApi.NODE_MAP.userProfile;
        let data = {
            userId,
            csrf_token: '',
        };

        let json = await this.request(node, data);
        let user = makeUserProfile(json, userId);

        let webUrl = 'https://music.163.com/user?id=' + userId;
        let html = await request({
            method: 'GET',
            url: webUrl,
            jar: this.cookieJar || null,
            headers: NeteaseMusicApi.WEB_HEADERS,
            gzip: true,
        });

        let info = getInfosFromHtml(<any>html);
        return { ...user, ...info };
    }


    /**
     * user's favorite songs is at a collection
     */
    public async userFavoriteSongs(userId: string): Promise<Array<ISong>> {
        let collections = await this.userFavoriteCollections(userId, 0, 1);
        if (collections.length < 1) { return []; }
        let collectionId = collections[0].collectionOriginalId;
        let collection = await this.collection(collectionId);
        return collection.songs;
    }


    public async userFavoriteArtists(userId: string, offset: number = 0, limit: number = 10, order: boolean = false): Promise<Array<IArtist>> {
        if (!this.logined()) {
            return [];
        }

        let account = this.account;

        // logined user's favorite artists list can only be got
        if (account.user.userOriginalId != userId) {
            return [];
        }

        let node = NeteaseMusicApi.NODE_MAP.userFavoriteArtists;
        let data = {
            offset,
            limit,
            order,
        };
        let json = await this.request(node, data);
        return makeArtists(json.data);
    }


    /**
     * user's favorite and created collections are in here,
     * discriminated by userId
     */
    public async userFavoriteCollections(userId: string, offset: number = 0, limit: number = 10, order: boolean = false): Promise<Array<ICollection>> {
        let node = NeteaseMusicApi.NODE_MAP.userFavoriteCollections;
        let data = {
            uid: userId,
            offset,
            limit,
            order,
        };
        let json = await this.request(node, data);
        return makeCollections(json.playlist);
    }


    /**
     * order is false, ordering by addition time desc
     */
    public async userFollowings(userId: string, offset: number = 0, limit: number = 10, order: boolean = false): Promise<Array<IUserProfile>> {
        let node = NeteaseMusicApi.NODE_MAP.userFollowings + userId;
        let data = {
            offset,
            limit,
            order,
        };
        let json = await this.request(node, data);
        return makeUserProfiles(json.follow);
    }


    public async userFollowers(userId: string, offset: number = 0, limit: number = 10, order: boolean = false): Promise<Array<IUserProfile>> {
        let node = NeteaseMusicApi.NODE_MAP.userFollowers;
        let data = {
            userId,
            offset,
            limit,
            order,
        };
        let json = await this.request(node, data);
        return makeUserProfiles(json.followeds);
    }


    /**
     * songId is ISong.songOriginalId, as following
     */
    public async userLikeSong(songId: string, _?, dislike: boolean = false): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError(
                dislike ?
                    '[NeteaseMusicApi] deleting one song from favorite songs list needs to login' :
                    '[NeteaseMusicApi] Saving one song to favorite songs list needs to login');
        }
        let userId = this.account.user.userOriginalId;

        let collections = await this.userFavoriteCollections(userId, 0, 1);
        if (collections.length < 1) {
            throw new ServerError('[NeteaseMusicApi] No user favorite collection');
        }
        let collectionId = collections[0].collectionOriginalId;

        let node = NeteaseMusicApi.NODE_MAP.userLikeSong;
        let data = {
            op: dislike ? 'del' : 'add',
            pid: collectionId,
            trackIds: JSON.stringify([songId]),
        };
        let json = await this.request(node, data);
        return json.code == 200;
    }


    public async userLikeArtist(artistId: string, _?, dislike: boolean = false): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError(
                dislike ?
                    '[NeteaseMusicApi] deleting one artist needs to login' :
                    '[NeteaseMusicApi] Saving one artist needs to login');
        }

        let node = dislike ?
            NeteaseMusicApi.NODE_MAP.userDislikeArtist :
            NeteaseMusicApi.NODE_MAP.userLikeArtist;
        let data = {
            artistId,
            artistIds: JSON.stringify([artistId]),
        };
        let json = await this.request(node, data);
        return json.code == 200;
    }


    /**
     * Cookie 'os=pc' is needed
     */
    public async createCollection(collectionName: string): Promise<ICollection> {
        if (!this.logined()) {
            throw new NoLoginError('[NeteaseMusicApi] Creating one collection needs to login');
        }

        let account: IAccount = this.getAccount();
        let csrf_token = account.cookies['__csrf'];

        let node = NeteaseMusicApi.NODE_MAP.createCollection;
        let data = {
            name: collectionName,
            csrf_token,
        };
        let json = await this.request(node, data);
        return makeCollection(json.playlist);
    }


    public async userLikeAlbum(albumId: string, _?): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError('[NeteaseMusicApi] Save one album needs to login');
        }

        let account: IAccount = this.getAccount();
        let csrf_token = account.cookies['__csrf'];

        let album = await this.album(albumId);
        let songIds = album.songs.map(song => song.songOriginalId).reverse();
        let collection = await this.createCollection(album.albumName);

        let node = NeteaseMusicApi.NODE_MAP.userLikeSong;
        let data = {
            op: 'add', // 'del'
            pid: collection.collectionOriginalId,
            trackIds: JSON.stringify(songIds),
            csrf_token,
        };
        let json = await this.request(node, data);
        return json.code == 200;
    }


    public async userLikeCollection(collectionId: string, _?, dislike: boolean = false): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError(
                dislike ?
                    '[NeteaseMusicApi] deleting one collection needs to login' :
                    '[NeteaseMusicApi] Saving one collection needs to login'
            );
        }

        let account: IAccount = this.getAccount();
        let csrf_token = account.cookies['__csrf'];

        let node = dislike ?
            NeteaseMusicApi.NODE_MAP.userDislikeCollection :
            NeteaseMusicApi.NODE_MAP.userLikeCollection;
        let data = dislike ? {
            id: collectionId,
            pid: collectionId,
            csrf_token,
        } : {
                id: collectionId,
                csrf_token,
            };
        let json = await this.request(node, data);
        return json.code == 200;
    }


    public async userLikeUserProfile(userId: string, _?, dislike: boolean = false): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError(
                dislike ?
                    '[NeteaseMusicApi] deleting one collection needs to login' :
                    '[NeteaseMusicApi] Saving one collection needs to login'
            );
        }

        let node = (dislike ?
            NeteaseMusicApi.NODE_MAP.userDislikeUserProfile :
            NeteaseMusicApi.NODE_MAP.userLikeUserProfile) + userId;
        let data = {};
        let json = await this.request(node, data);
        return json.code == 200;
    }


    public async userDislikeSong(songId: string, _?): Promise<boolean> {
        return this.userLikeSong(songId, null, true);
    }


    public async userDislikeAlbum(albumId: string, _?): Promise<boolean> {
        // there is no album saved at netease music
        return false;
    }


    public async userDislikeArtist(artistId: string, _?): Promise<boolean> {
        return this.userLikeArtist(artistId, null, true);
    }


    public async userDislikeCollection(collectionId: string, _?): Promise<boolean> {
        return this.userLikeCollection(collectionId, null, true);
    }


    public async userDislikeUserProfile(userId: string, _?): Promise<boolean> {
        return this.userLikeUserProfile(userId, null, true);
    }


    public async recommendNewSongs(offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let node = NeteaseMusicApi.NODE_MAP.recommendNewSongs;
        let data = {
            type: "recommend",
        };
        let json = await this.request(node, data);
        return makeSongs((json['result'] || []).map(i => i['song']));
    }


    /**
     * Login is needed
     */
    public async recommendSongs(offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        if (!this.logined()) {
            return this.recommendNewSongs(offset, limit);
        }

        let node = NeteaseMusicApi.NODE_MAP.recommendSongs;
        let data = {
            limit,
            offset,
            total: true,
        };
        let json = await this.request(node, data);
        return makeSongs(json['recommend'] || []);
    }


    public async recommendCollections(offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        if (this.logined()) {
            return this.recommendDailyCollections(offset, limit);
        }

        let node = NeteaseMusicApi.NODE_MAP.recommendCollections;
        let data = {
            limit: limit,
            offset: offset,
            n: limit,
            total: true,
        };
        let json = await this.request(node, data);
        return makeCollections(json['result'] || []);
    }


    public async recommendDailyCollections(offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        if (!this.logined()) {
            throw new NoLoginError('[NeteaseMusicApi] `recommendDailyCollections` needs to login');
        }

        let node = NeteaseMusicApi.NODE_MAP.recommendDailyCollections;
        let data = {};
        let json = await this.request(node, data);
        return makeCollections(json['recommend'] || []);
    }


    public async playLog(songId: string, seek: number): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError('[NeteaseMusicApi] recording one played song needs to login');
        }

        let account: IAccount = this.getAccount();
        let csrf_token = account.cookies['__csrf'];

        let node = NeteaseMusicApi.NODE_MAP.playLog;
        let data = {
            logs: JSON.stringify(
                [{
                    action: 'play',
                    json: {
                        end: 'ui',
                        time: seek,
                        wifi: 0,
                        type: 'song',
                        id: parseInt(songId),
                    }
                }]
            ),
            csrf_token,
        };
        let json = await this.request(node, data);
        return json.code == 200;
    }


    public resizeImageUrl(url: string, size: ESize | number): string {
        return resizeImageUrl(url, size, (url, size) => `${url}?param=${size}y${size}`);
    }
}
