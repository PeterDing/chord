'use strict';

import { Logger, LogLevel } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';
const loggerWarning = new Logger(filenameToNodeName(__filename), LogLevel.Warning);

import { ok } from 'chord/base/common/assert';

import { ORIGIN } from 'chord/music/common/origin';

import { NoLoginError, ServerError } from 'chord/music/common/errors';

import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { ILyric } from 'chord/music/api/lyric';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IListOption } from 'chord/music/api/listOption';
import { TMusicItems } from 'chord/music/api/items';

import { IUserProfile, IAccount } from 'chord/music/api/user';

import { ESize, resizeImageUrl } from 'chord/music/common/size';

import { makeCookieJar, makeCookie, CookieJar } from 'chord/base/node/cookies';
import { request, IRequestOptions, IResponse } from 'chord/base/node/_request';

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
} from 'chord/music/spotify/parser';

import { querystringify } from 'chord/base/node/url';


export class SpotifyMusicApi {
    static readonly NODE_MAP = {
        audio: '/audio-uri',
        song: '/tracks',
        lyric: 'weapi/song/lyric',
        album: '/albums',
        collection: '/playlists',

        artist: '/artists',

        search: '/search',

        similarSongs: 'weapi/v1/discovery/simiSong',
        similarArtists: 'weapi/discovery/simiArtist',
        similarCollections: 'weapi/discovery/simiPlaylist',

        collectionListOptions: 'weapi/playlist/catalogue',
        collectionList: 'weapi/playlist/list',
        artistList: 'weapi/artist/list',

        newSongs: 'weapi/v1/discovery/new/songs',
        newAlbums: 'weapi/album/new',
        newCollections: 'weapi/playlist/list',

        login: 'weapi/login',
        loginRefresh: 'weapi/login/token/refresh',

        userProfile: '/user',

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

    public domain: string = 'http://127.0.0.1:8081';
    private account: IAccount;
    private cookieJar: CookieJar;


    constructor() {
        this.cookieJar = new CookieJar();
        this.cookieJar.setCookieSync('', this.domain);
    }


    public async request(
        method: string,
        node: string,
        params?: any,
        data?: any,
    ): Promise<IResponse> {
        let url = this.domain + node;
        if (params) {
            url = url + '?' + querystringify(params);
        }

        let options: IRequestOptions = {
            method,
            jar: this.cookieJar,
            data,
        };

        let resp = await request(url, options);
        // TODO: Check result
        return resp;
    }


    /**
     * Get directly audio url
     */
    public async audios(songId: string, supKbps?: number): Promise<Array<IAudio>> {
        let node = SpotifyMusicApi.NODE_MAP.audio + '/' + songId;
        let resp = await this.request('GET', node);
        let uri = resp.data;
        if (uri.startsWith('/audio-stream-with-sign')) {
            let audio: IAudio = {
                format: 'ogg',
                kbps: supKbps,
                url: this.domain + uri,
            };
            return [audio];
        }
        return [];
    }


    public async song(songId: string): Promise<ISong> {
        let node = SpotifyMusicApi.NODE_MAP.song + '/' + songId;
        let resp = await this.request('GET', node);
        return makeSong(resp.data)
    }


    public async lyric(songId: string): Promise<ILyric> {
        let node = SpotifyMusicApi.NODE_MAP.lyric;
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
        let node = SpotifyMusicApi.NODE_MAP.album + '/' + albumId;
        let resp = await this.request('GET', node);
        return makeAlbum(resp.data);
    }


    public async artist(artistId: string): Promise<IArtist> {
        let node = SpotifyMusicApi.NODE_MAP.artist + '/' + artistId;
        let resp = await this.request('GET', node);
        return makeArtist(resp.data);
    }


    public async artistSongs(artistId: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let node = SpotifyMusicApi.NODE_MAP.artist + '/' + artistId + '/top-tracks';
        let params = { offset, limit };
        let resp = await this.request('GET', node, params);
        return makeSongs(resp.data);
    }


    public async artistAlbums(artistId: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let node = SpotifyMusicApi.NODE_MAP.artist + '/' + artistId + '/albums';
        let params = { offset, limit };
        let resp = await this.request('GET', node, params);
        return makeAlbums(resp.data['items']);
    }


    public async collection(collectionId: string, size: number = 10000): Promise<ICollection> {
        let node = SpotifyMusicApi.NODE_MAP.collection + '/' + collectionId;
        let resp = await this.request('GET', node);
        return makeCollection(resp.data);
    }


    /**
     * Search
     */
    public async search(type: string, keyword: string, offset: number = 0, limit: number = 10): Promise<any> {
        let node = SpotifyMusicApi.NODE_MAP.search;
        let params = {
            q: keyword,
            type,
            limit,
            offset,
        };
        let resp = await this.request('GET', node, params);
        return resp.data;
    }


    /**
     * Search songs
     *
     * type = 'track'
     */
    public async searchSongs(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let json = await this.search('track', keyword, offset, limit);
        if (!json['tracks']) { return []; }
        return makeSongs(json['tracks']['items'] || []);
    }


    /**
     * Search albums
     *
     * type = 'album'
     */
    public async searchAlbums(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let json = await this.search('album', keyword, offset, limit);
        if (!json['albums']) { return []; }
        return makeAlbums(json['albums']['items'] || []);
    }


    /**
     * Search artists
     *
     * type = 'artist'
     */
    public async searchArtists(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IArtist>> {
        let json = await this.search('artist', keyword, offset, limit);
        if (!json['artists']) { return []; }
        return makeArtists(json['artists']['items'] || []);
    }


    /**
     * Search collections
     * type = 1000
     */
    public async searchCollections(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let json = await this.search('playlist', keyword, offset, limit);
        if (!json['playlists']) { return []; }
        return makeCollections(json['playlists']['items'] || []);
    }


    /**
     * Netease only return 3 collections
     */
    public async songBelongsToCollections(songId: string, limit: number = 5): Promise<Array<ICollection>> {
        let node = SpotifyMusicApi.NODE_MAP.similarCollections;
        let data = {
            songid: songId,
        };
        let json = await this.request(node, data);
        return makeCollections(json['playlists']);
    }


    public collectionListOrders(): Array<{ name: string, id: string }> {
        return [
            { id: 'hot', name: '最热' },
            { id: 'new', name: '最新' },
        ];
    }


    public async collectionListOptions(): Promise<Array<IListOption>> {
        let node = SpotifyMusicApi.NODE_MAP.collectionListOptions;
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
        return options;
    }


    /**
     * order:
     *     hot
     *     new
     */
    public async collectionList(cat: string, order: string = 'hot', offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let node = SpotifyMusicApi.NODE_MAP.collectionList;
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


    public async artistListOptions(): Promise<Array<IListOption>> {
        return ARTIST_LIST_OPTIONS;
    }


    public async artistList(
        category: string = null,
        initial: string = null,
        offset: number = 0,
        limit: number = 10): Promise<Array<IArtist>> {
        let node = SpotifyMusicApi.NODE_MAP.artistList;
        let data = {
            categoryCode: category || undefined,
            initial: initial || undefined,
            offset: offset,
            limit: limit,
            total: true,
        };
        let json = await this.request(node, data);
        return makeArtists(json['artists']);
    }


    /**
     * Get new songs
     *
     * Here, offset, limit are not functional
     */
    public async newSongs(offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let node = SpotifyMusicApi.NODE_MAP.newSongs;
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
        let node = SpotifyMusicApi.NODE_MAP.newAlbums;
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
        let node = SpotifyMusicApi.NODE_MAP.newCollections;
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


    public setDomain(domain: string): void {
        this.domain = domain;
    }


    public async login(accountName: string, password: string): Promise<IAccount> {
        let tmpApi = new SpotifyMusicApi();

        let node = SpotifyMusicApi.NODE_MAP.login;
        let data = {
            username: accountName,
            password,
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
        ok(account.user.origin == ORIGIN.netease, `[SpotifyMusicApi.setAccount]: this account is not a netease account`);

        let domain = this.domain;

        Object.keys(account.cookies).forEach(key => {
            let cookie = makeCookie(key, account.cookies[key], domain);
            this.cookieJar.setCookie(cookie, domain.startsWith('http') ? domain : 'http://' + domain);
        });

        this.account = account;
    }


    public getAccount(): IAccount {
        return this.account;
    }


    public logined(): boolean {
        return !!this.account && !!this.account.cookies && !!this.account.cookies['MUSIC_U'];
    }


    public async loginRefresh(): Promise<any> {
        let node = SpotifyMusicApi.NODE_MAP.loginRefresh;
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
        let node = SpotifyMusicApi.NODE_MAP.userProfile;
        let resp = await this.request('GET', node);
        return makeUserProfile(resp.data);
    }


    /**
     * user's favorite songs is at a collection
     */
    public async userFavoriteSongs(userId: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let collections = await this.userFavoriteCollections(userId, 0, 1);
        if (collections.length < 1) { return []; }
        let collectionId = collections[0].collectionOriginalId;
        let collection = await this.collection(collectionId);
        return collection.songs.slice(offset, offset + limit);
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

        let node = SpotifyMusicApi.NODE_MAP.userFavoriteArtists;
        let data = {
            offset,
            limit,
            order, // order is false, ordering by addition time desc
        };
        let json = await this.request(node, data);
        return makeArtists(json.data);
    }


    /**
     * user's favorite and created collections are in here,
     * discriminated by userId
     */
    public async userFavoriteCollections(userId: string, offset: number = 0, limit: number = 10, order: boolean = false): Promise<Array<ICollection>> {
        let node = SpotifyMusicApi.NODE_MAP.userFavoriteCollections;
        let data = {
            uid: userId,
            offset,
            limit,
            order, // order is false, ordering by addition time desc
        };
        let json = await this.request(node, data);
        return makeCollections(json.playlist);
    }


    public async userFollowings(userId: string, offset: number = 0, limit: number = 10, order: boolean = false): Promise<Array<IUserProfile>> {
        let node = SpotifyMusicApi.NODE_MAP.userFollowings + userId;
        let data = {
            offset,
            limit,
            order, // order is false, ordering by addition time desc
        };
        let json = await this.request(node, data);
        return makeUserProfiles(json.follow);
    }


    public async userFollowers(userId: string, offset: number = 0, limit: number = 10, order: boolean = false): Promise<Array<IUserProfile>> {
        let node = SpotifyMusicApi.NODE_MAP.userFollowers;
        let data = {
            userId,
            offset,
            limit,
            order, // order is false, ordering by addition time desc
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
                    '[SpotifyMusicApi] deleting one song from favorite songs list needs to login' :
                    '[SpotifyMusicApi] Saving one song to favorite songs list needs to login');
        }
        let userId = this.account.user.userOriginalId;

        let collections = await this.userFavoriteCollections(userId, 0, 1);
        if (collections.length < 1) {
            throw new ServerError('[SpotifyMusicApi] No user favorite collection');
        }
        let collectionId = collections[0].collectionOriginalId;

        let node = SpotifyMusicApi.NODE_MAP.userLikeSong;
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
                    '[SpotifyMusicApi] deleting one artist needs to login' :
                    '[SpotifyMusicApi] Saving one artist needs to login');
        }

        let node = dislike ?
            SpotifyMusicApi.NODE_MAP.userDislikeArtist :
            SpotifyMusicApi.NODE_MAP.userLikeArtist;
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
            throw new NoLoginError('[SpotifyMusicApi] Creating one collection needs to login');
        }

        let account: IAccount = this.getAccount();
        let csrf_token = account.cookies['__csrf'];

        let node = SpotifyMusicApi.NODE_MAP.createCollection;
        let data = {
            name: collectionName,
            csrf_token,
        };
        let json = await this.request(node, data);
        return makeCollection(json.playlist);
    }


    public async userLikeAlbum(albumId: string, _?): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError('[SpotifyMusicApi] Save one album needs to login');
        }

        let account: IAccount = this.getAccount();
        let csrf_token = account.cookies['__csrf'];

        let album = await this.album(albumId);
        let songIds = album.songs.map(song => song.songOriginalId).reverse();
        let collection = await this.createCollection(album.albumName);

        let node = SpotifyMusicApi.NODE_MAP.userLikeSong;
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
                    '[SpotifyMusicApi] deleting one collection needs to login' :
                    '[SpotifyMusicApi] Saving one collection needs to login'
            );
        }

        let account: IAccount = this.getAccount();
        let csrf_token = account.cookies['__csrf'];

        let node = dislike ?
            SpotifyMusicApi.NODE_MAP.userDislikeCollection :
            SpotifyMusicApi.NODE_MAP.userLikeCollection;
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
                    '[SpotifyMusicApi] deleting one collection needs to login' :
                    '[SpotifyMusicApi] Saving one collection needs to login'
            );
        }

        let node = (dislike ?
            SpotifyMusicApi.NODE_MAP.userDislikeUserProfile :
            SpotifyMusicApi.NODE_MAP.userLikeUserProfile) + userId;
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
        let node = SpotifyMusicApi.NODE_MAP.recommendNewSongs;
        let data = {
            type: "recommend",
        };
        let json = await this.request(node, data);
        return makeSongs((json['result'] || []).map(i => i['song'])).slice(offset, offset + limit);
    }


    /**
     * Login is needed
     */
    public async recommendSongs(offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        if (!this.logined()) {
            return this.recommendNewSongs(offset, limit);
        }

        let node = SpotifyMusicApi.NODE_MAP.recommendSongs;
        let data = {
            limit,
            offset,
            total: true,
        };
        let json = await this.request(node, data);
        return makeSongs(json['recommend'] || []).slice(offset, offset + limit);
    }


    public async recommendCollections(offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        if (this.logined()) {
            return this.recommendDailyCollections(offset, limit);
        }

        let node = SpotifyMusicApi.NODE_MAP.recommendCollections;
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
            throw new NoLoginError('[SpotifyMusicApi] `recommendDailyCollections` needs to login');
        }

        let node = SpotifyMusicApi.NODE_MAP.recommendDailyCollections;
        let data = {};
        let json = await this.request(node, data);
        return makeCollections(json['recommend'] || []);
    }


    public async playLog(songId: string, seek: number): Promise<boolean> {
        return true;
    }


    public resizeImageUrl(url: Array<any>, size: ESize | number): string {
        return resizeImageUrl(url, size, (url: Array<any>, size) => {
            for (let item of url) {
                if (item['width'] >= size) {
                    return item['url'];
                }
            }
            return (url && url.length > 0) ? url.slice(-1)[0]['url'] : '';
        });
    }


    public async fromURL(input: string): Promise<Array<TMusicItems>> {
        let chunks = input.split(' ');
        let items = [];
        for (let chunk of chunks) {
            let m;
            let originId;
            let type;

            let matchList = [
                // song
                [/song\?.*&?id=(\d+)/, 'song'],

                // artist
                [/artist\?.*&?id=(\d+)/, 'artist'],

                // album
                [/album\?.*&?id=(\d+)/, 'album'],

                // playlist
                [/playlist\?.*&?id=(\d+)/, 'collection'],

                // user
                [/home\?.*&?id=(\d+)/, 'user'],
            ];
            for (let [re, tp] of matchList) {
                m = (re as RegExp).exec(chunk);
                if (m) {
                    originId = m[1];
                    type = tp;
                    break;
                }
            }

            if (originId) {
                let item;
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
                    case 'collection':
                        item = await this.collection(originId);
                        items.push(item);
                        break;
                    case 'user':
                        item = await this.userProfile(originId);
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
