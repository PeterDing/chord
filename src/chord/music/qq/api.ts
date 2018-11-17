'use strict';

import { remote } from 'electron';

import { ok } from 'chord/base/common/assert';
import { sleep } from 'chord/base/common/time';

import { ORIGIN } from 'chord/music/common/origin';

import { NoLoginError, LoginTimeoutError } from 'chord/music/common/errors';

import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';

import { IUserProfile, IAccount } from 'chord/music/api/user';

import { ESize, resizeImageUrl } from 'chord/music/common/size';

import { CookieJar, makeCookie, makeCookieJar } from 'chord/base/node/cookies';
import { querystringify } from 'chord/base/node/url';
import { request, IRequestOptions } from 'chord/base/node/_request';

import {
    makeSong,
    makeSongs,
    makeAlbum,
    makeAlbums,
    makeCollection,
    makeEmptyCollection,
    makeCollections,
    makeArtist,
    makeArtists,

    makeUserProfile,
    makeUserProfiles,
} from 'chord/music/qq/parser';

import { getACSRFToken } from 'chord/music/qq/util';

import { AUDIO_FORMAT_MAP } from 'chord/music/qq/parser';


export class QQMusicApi {

    static readonly HEADERS = {
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,ja;q=0.6,zh-TW;q=0.5',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
        'accept': '*/*',
    };

    static readonly AUDIO_URI = 'http://dl.stream.qqmusic.qq.com/';

    static readonly NODE_MAP = {
        qqKey: 'https://c.y.qq.com/base/fcgi-bin/fcg_musicexpress.fcg',
        song: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        album: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg',

        artist: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
        artistLikeCount: 'https://c.y.qq.com/rsc/fcgi-bin/fcg_order_singer_getnum.fcg',
        artistSongs: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
        artistAlbums: 'https://u.y.qq.com/cgi-bin/musicu.fcg',

        collection: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
        collectionAddons: 'https://c.y.qq.com/3gmusic/fcgi-bin/3g_dir_order_uinlist',

        searchSongs: 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp',
        searchAlbums: 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp',
        searchCollections: 'https://c.y.qq.com/soso/fcgi-bin/client_music_search_songlist',

        userProfile: 'https://c.y.qq.com/rsc/fcgi-bin/fcg_get_profile_homepage.fcg',
        userFavoriteSongs: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
        userFavoriteAlbums: 'https://c.y.qq.com/fav/fcgi-bin/fcg_get_profile_order_asset.fcg',
        userFavoriteArtists: 'https://c.y.qq.com/rsc/fcgi-bin/fcg_order_singer_getlist.fcg',
        userFavoriteCollections: 'https://c.y.qq.com/fav/fcgi-bin/fcg_get_profile_order_asset.fcg',
        userCreatedCollections: 'https://c.y.qq.com/rsc/fcgi-bin/fcg_user_created_diss',
        userFollow: 'https://c.y.qq.com/rsc/fcgi-bin/friend_follow_or_listen_list.fcg',
        userLikeSong: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_music_add2songdir.fcg',
        userLikeArtist: 'https://c.y.qq.com/rsc/fcgi-bin/fcg_order_singer_add.fcg',
        userLikeAlbum: 'https://c.y.qq.com/folder/fcgi-bin/fcg_qm_order_diss.fcg',
        userLikeCollection: 'https://c.y.qq.com/folder/fcgi-bin/fcg_qm_order_diss.fcg',
        userDislikeSong: 'https://c.y.qq.com/qzone/fcg-bin/fcg_music_delbatchsong.fcg',
        userDislikeArtist: 'https://c.y.qq.com/rsc/fcgi-bin/fcg_order_singer_del.fcg',
        userDislikeAlbum: 'https://c.y.qq.com/folder/fcgi-bin/fcg_qm_order_diss.fcg',
        userDislikeCollection: 'https://c.y.qq.com/folder/fcgi-bin/fcg_qm_order_diss.fcg',
    };

    private account: IAccount;
    private cookieJar: CookieJar;


    constructor() {
        this.cookieJar = makeCookieJar();
    }


    private getACSRFToken(): string {
        return this.account ? getACSRFToken(this.account.cookies) : null;
    }


    public async request(method: string, url: string, params?: any, data?: any, referer?: string): Promise<any> {
        if (params) {
            url = url + '?' + querystringify(params);
        }

        referer = referer || 'https://y.qq.com';
        let headers = { ...QQMusicApi.HEADERS, referer };

        let options: IRequestOptions = {
            method,
            url,
            jar: this.cookieJar || null,
            headers: headers,
            body: data,
            gzip: true,
        };
        let body: any = await request(options);
        return body.trim().startsWith('<') ? body : JSON.parse(body);
    }


    public async qqKey(guid: string): Promise<string> {
        let params = {
            'json': 3,
            'guid': guid,
            'format': 'json',
        };
        let url = QQMusicApi.NODE_MAP.qqKey;
        let json = await this.request('GET', url, params);
        return json.key;
    }


    public makeAudios(song: ISong, qqKey: string, guid: string): Array<IAudio> {
        return song.audios.filter(audio => !!AUDIO_FORMAT_MAP[`${audio.kbps || ''}${audio.format}`])
            .map(audio => {
                audio.url = QQMusicApi.AUDIO_URI + AUDIO_FORMAT_MAP[`${audio.kbps || ''}${audio.format}`] + song.songMediaMid + '.' + audio.format + '?vkey=' + qqKey + '&guid=' + guid + '&uin=0&fromtag=53';
                return audio;
            });
    }


    public async audios(songId: string): Promise<Array<IAudio>> {
        let guid = Math.floor(Math.random() * 1000000000).toString();
        let qqKey = await this.qqKey(guid);
        let song = await this.song(songId);
        return this.makeAudios(song, qqKey, guid);
    }


    public async songsAudios(songs: Array<ISong>): Promise<Array<Array<IAudio>>> {
        let guid = Math.floor(Math.random() * 1000000000).toString();
        let qqKey = await this.qqKey(guid);
        return songs.map(song => this.makeAudios(song, qqKey, guid));
    }


    public async song(songId: string): Promise<ISong> {
        let data = {
            "comm": {
                "uin": 0,
                "format": "json",
                "inCharset": "utf-8",
                "outCharset": "utf-8",
                "notice": 0,
                "platform": "h5",
                "needNewCode": 1
            },
            "detail": {
                "module": "music.pf_song_detail_svr",
                "method": "get_song_detail",
                "param": {
                    "song_id": parseInt(songId),
                }
            },
            // "simsongs": {
            // "module": "rcmusic.similarSongRadioServer",
            // "method": "get_simsongs",
            // "param": {
            // "songid": 307012
            // }
            // },
            // "gedan": {
            // "module": "music.mb_gedan_recommend_svr",
            // "method": "get_related_gedan",
            // "param": {
            // "sin": 0,
            // "last_id": 0,
            // "song_type": 1,
            // "song_id": 307012
            // }
            // }
        };
        let url = QQMusicApi.NODE_MAP.song;
        let json = await this.request('POST', url, null, JSON.stringify(data));
        return makeSong(json['detail']['data']);
    }


    public async album(albumId: string): Promise<IAlbum> {
        let params = {
            albumid: albumId,
            uin: '0',
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'h5',
            needNewCode: '1',
            '_': Date.now(),
        };
        let url = QQMusicApi.NODE_MAP.album;
        let json = await this.request('GET', url, params);
        return makeAlbum(json['data']);
    }


    public async artistLikeCount(artistMid: string): Promise<number> {
        let params = {
            loginUin: '0',
            hostUin: '0',
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
            singermid: artistMid,
            utf8: '1',
        }
        let url = QQMusicApi.NODE_MAP.artistLikeCount;
        let json = await this.request('GET', url, params);
        return json.num;
    }


    public async artist(artistId: string): Promise<IArtist> {
        let params = {
            singerid: artistId,
            uin: '0',
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'h5page',
            needNewCode: '1',
            order: 'listen',
            from: 'h5',
            num: 1,
            begin: 0,
            '_': Date.now(),
        };
        let url = QQMusicApi.NODE_MAP.artist;
        let json = await this.request('GET', url, params);
        let artist = makeArtist(json['data']);
        let likeCount = await this.artistLikeCount(artist.artistMid);
        artist.likeCount = likeCount;
        return artist;
    }


    public async artistSongs(artistId: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let params = {
            singerid: artistId,
            uin: '0',
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'h5page',
            needNewCode: '1',
            order: 'listen',
            from: 'h5',
            num: limit,
            begin: offset,
            '_': Date.now(),
        };
        let url = QQMusicApi.NODE_MAP.artistSongs;
        let json = await this.request('GET', url, params);
        return makeSongs(json['data']['list'].map(info => info['musicData']));
    }


    /**
     * WARN: `artistMid`
     */
    public async artistAlbums(artistMid: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let data = JSON.stringify({
            "singerAlbum": {
                "method": "get_singer_album",
                "param": {
                    "singermid": artistMid,
                    "order": "time",
                    "begin": offset,
                    "num": limit,
                    "exstatus": 1
                },
                "module": "music.web_singer_info_svr"
            }
        });
        let params = {
            loginUin: '0',
            hostUin: '0',
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
            data,
        };
        let url = QQMusicApi.NODE_MAP.artistAlbums;
        let json = await this.request('GET', url, params);
        return makeAlbums(json['singerAlbum']['data']['list']);
    }


    public async collectionAddons(collectionId: string): Promise<any> {
        let params = {
            loginUin: '0',
            hostUin: '0',
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
            cid: '322',
            nocompress: '1',
            disstid: collectionId,
        };
        let url = QQMusicApi.NODE_MAP.collectionAddons;
        let referer = `https://y.qq.com/n/yqq/playlist/${collectionId}.html`;
        let json = await this.request('GET', url, params, null, referer);
        return json;
    }


    public async collection(collectionId: string, offset: number = 0, limit: number = 1000): Promise<ICollection> {
        let params = {
            uin: '0',
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'h5',
            needNewCode: '1',
            new_format: '1',
            pic: '500',
            disstid: collectionId,
            type: '1',
            json: '1',
            utf8: '1',
            onlysong: '0',
            picmid: '1',
            nosign: '1',
            song_begin: offset,
            song_num: limit,
            '_': Date.now(),
        };
        let url = QQMusicApi.NODE_MAP.collection;
        let referer = 'https://y.qq.com/w/taoge.html?ADTAG=newyqq.taoge&id=' + collectionId;
        let json = await this.request('GET', url, params, null, referer);
        if (!json['cdlist'] || !json['cdlist'].length) {
            return makeEmptyCollection(collectionId);
        }
        let collection = makeCollection(json['cdlist'][0]);
        let addons = await this.collectionAddons(collection.collectionOriginalId);
        collection.userId = addons['diruin'] ? `qq|collection|${addons['diruin']}` : collection.userId;
        collection.likeCount = addons['totalnum'];
        return collection;
    }


    public async searchSongs(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let params = {
            remoteplace: 'txt.yqq.song',
            format: 'json',
            p: offset,
            n: limit,
            w: keyword,
            aggr: 1,
            cr: 1,
            lossless: 1,
            flag_qc: 1,
            new_json: 1,
        };
        let url = QQMusicApi.NODE_MAP.searchSongs;
        let json = await this.request('GET', url, params);
        if (!json['data']) { return []; }
        return makeSongs(json['data']['song']['list']);
    }


    public async searchAlbums(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let params = {
            platform: 'yqq',
            ct: 24,
            qqmusic_ver: 1298,
            remoteplace: 'txt.yqq.album',
            format: 'json',
            p: offset,
            n: limit,
            w: keyword,
            lossless: 0,
            aggr: 0,
            sem: 10,
            t: 8,
            catZhida: 1,
        };
        let url = QQMusicApi.NODE_MAP.searchAlbums;
        let json = await this.request('GET', url, params);
        if (!json['data']) { return []; }
        return makeAlbums(json['data']['album']['list']);
    }


    public async searchCollections(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let params = {
            remoteplace: 'txt.yqq.playlist',
            flag_qc: '0',
            page_no: offset,
            num_per_page: limit,
            query: keyword,
            loginUin: '0',
            hostUin: '0',
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
        };
        let url = QQMusicApi.NODE_MAP.searchCollections;
        let json = await this.request('GET', url, params);
        if (!json['data']) { return []; }
        return makeCollections(json['data']['list']);
    }


    /**
     * TODO: use qr code login
     */
    public async login(): Promise<IAccount> {
        let url = 'https://xui.ptlogin2.qq.com/cgi-bin/xlogin?appid=1006102&daid=384&low_login=1&pt_no_auth=1&s_url=https://y.qq.com/vip/daren_recruit/apply.html&style=40';
        // let url = 'https://y.qq.com'
        let win = new remote.BrowserWindow(
            {
                width: 800, height: 600,
                webPreferences: {
                    webSecurity: true,
                    nodeIntegration: false,
                    allowRunningInsecureContent: true
                },
            });
        // win.webContents.openDevTools();
        win.on('close', () => {
            win = null;
        });
        win.loadURL(url);
        // clear cache
        win.webContents.session.clearStorageData();
        win.show();

        // timeout is 2 min
        // await sleep(5000);
        for (let timeout = 0; timeout < 12000000; timeout += 1000) {
            // waiting to login
            await sleep(1000);
            let cookiesStr = await win.webContents.executeJavaScript('Promise.resolve(document.cookie)', true);
            if (cookiesStr.includes('pt4_token')) {
                let cookies = {};
                cookiesStr.split('; ').forEach(chunk => {
                    let index = chunk.indexOf('=');
                    cookies[chunk.slice(0, index)] = chunk.slice(index + 1);
                });

                // get user profile
                let userOriginalId = cookies['ptui_loginuin'];
                let tmpApi = new QQMusicApi();

                let domain = 'qq.com';
                Object.keys(cookies).forEach(key => {
                    let cookie = makeCookie(key, cookies[key], domain);
                    tmpApi.cookieJar.setCookie(cookie, domain.startsWith('http') ? domain : 'http://' + domain);
                });

                let userProfile = await tmpApi.userProfile(userOriginalId);

                let account: IAccount = {
                    user: userProfile,
                    type: 'account',
                    cookies,
                }

                // close window
                win.close();

                return account;
            }
        }

        // Handle timeout
        win.close();
        throw new LoginTimeoutError('Timeout !!!');
    }


    public setAccount(account: IAccount): void {
        ok(account.user.origin == ORIGIN.qq, `[QQMusicApi.setAccount]: this account is not a qq account`);

        let domain = 'qq.com';
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
        return !!this.account && !!this.account.cookies && !!this.account.cookies['pt4_token'];
    }


    public async userProfile(userMid: string): Promise<IUserProfile> {
        let params = {
            hostUin: '0',
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
            cid: '205360838',
            ct: '20',
            userid: userMid,
            reqfrom: '1',
            reqtype: '0',
        };
        let url = QQMusicApi.NODE_MAP.userProfile;
        let json = await this.request('GET', url, params);
        return makeUserProfile(json.data);
    }


    /**
     * No need to login
     */
    public async userFavoriteSongs(userMid: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let collections = await this.userCreatedCollections(userMid, 0, 2);
        let collectionOriginalId = collections[0].collectionOriginalId;
        let collection = await this.collection(collectionOriginalId, offset, limit);
        return collection.songs;
    }


    /**
     * No need to login
     */
    public async userFavoriteAlbums(userMid: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let account = this.getAccount();
        let params = {
            loginUin: account.user.userOriginalId,
            hostUin: '0',
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
            ct: '20',
            cid: '205360956',
            userid: userMid,
            reqtype: '2',
            sin: offset,
            ein: limit,
        };
        let url = QQMusicApi.NODE_MAP.userFavoriteAlbums;
        let json = await this.request('GET', url, params);
        if (!json.data) { return []; }
        return makeAlbums(json.data.albumlist);
    }


    /**
     * TODO: Need to logined
     */
    public async userFavoriteArtists(userMid: string, offset: number = 1, limit: number = 10): Promise<Array<IArtist>> {
        if (!this.logined()) {
            throw new NoLoginError("[QQMusicApi] Geting user's favorite artists needs to login");
        }

        let account = this.getAccount();
        let params = {
            utf8: '1',
            page: offset,
            perpage: limit,
            uin: userMid,
            g_tk: this.getACSRFToken(),
            loginUin: account.user.userOriginalId,
            hostUin: '0',
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'GB2312',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
        };
        let referer = `https://y.qq.com/portal/profile.html?uin=${userMid}`;
        let url = QQMusicApi.NODE_MAP.userFavoriteArtists;
        let json = await this.request('GET', url, params, null, referer);
        return makeArtists(json.list);
    }


    public async userFavoriteCollections(userMid: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        if (!this.logined()) {
            throw new NoLoginError("[QQMusicApi] Geting user's favorite collections needs to login");
        }

        let account = this.getAccount();
        let params = {
            loginUin: account.user.userOriginalId,
            hostUin: '0',
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
            ct: '20',
            cid: '205360956',
            userid: userMid,
            reqtype: '3',
            sin: offset,
            ein: limit,
        };
        let url = QQMusicApi.NODE_MAP.userFavoriteCollections;
        let json = await this.request('GET', url, params);
        if (!json.data) { return []; }
        return makeCollections(json.data.cdlist);
    }


    public async userCreatedCollections(userMid: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        if (!this.logined()) {
            throw new NoLoginError("[QQMusicApi] Geting user's created collections needs to login");
        }

        let account = this.getAccount();
        let params = {
            hostuin: userMid,
            sin: offset,
            size: limit,
            loginUin: account.user.userOriginalId,
            hostUin: '0',
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
        };
        let url = QQMusicApi.NODE_MAP.userCreatedCollections;
        let json = await this.request('GET', url, params);
        if (!json.data) { return []; }
        let userId = 'qq|user|' + json.data['hostuin'].toString();
        userMid = json.data['encrypt_uin'];
        let userName = json.data['hostname'];
        let collections = makeCollections(offset == 0 ? json.data.disslist.slice(1) : json.data.disslist)
        collections.filter(collection => {
            collection.userId = userId;
            collection.userMid = userMid;
            collection.userName = userName;
        });
        return collections;
    }


    /**
     * TODO: Need to logined
     *
     * offset begins from 0
     *
     * followings: `is_listen = 0`
     * followers: `is_listen = 1`
     */
    protected async userFollows(userMid: string, offset: number = 0, limit: number = 10, ing: boolean = true): Promise<Array<IUserProfile>> {
        if (!this.logined()) {
            throw new NoLoginError("[QQMusicApi] Geting user's followings list needs to login");
        }
        let account = this.getAccount();
        let params = {
            utf8: '1',
            start: offset,
            num: limit,
            is_listen: ing ? '0' : '1',
            uin: userMid,
            loginUin: account.user.userOriginalId,
            hostUin: '0',
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
            g_tk: this.getACSRFToken(),
        };
        let url = QQMusicApi.NODE_MAP.userFollow;
        let json = await this.request('GET', url, params);
        return makeUserProfiles(json.list);
    }


    public async userFollowings(userMid: string, offset: number = 0, limit: number = 10): Promise<Array<IUserProfile>> {
        return this.userFollows(userMid, offset, limit, true);
    }


    public async userFollowers(userMid: string, offset: number = 0, limit: number = 10): Promise<Array<IUserProfile>> {
        return this.userFollows(userMid, offset, limit, false);
    }


    public async userLikeSong(songId: string, songMid: string): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError('[QQMusicApi] Saving one song to favorite songs list needs to login');
        }
        let account = this.getAccount();

        let params = {
            g_tk: this.getACSRFToken(),
        };
        let data = {
            loginUin: account.user.userOriginalId,
            hostUin: '0',
            format: 'fs',
            inCharset: 'GB2312',
            outCharset: 'utf8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
            g_tk: this.getACSRFToken(),
            uin: account.user.userOriginalId,
            midlist: songMid,
            typelist: '13',
            dirid: '201',
            addtype: '',
            formsender: '1',
            source: '153',
            r2: '0',
            r3: '1',
            utf8: '1',
        };
        let referer = 'https://imgcache.qq.com/music/miniportal_v4/tool/html/fp_utf8.html';
        let url = QQMusicApi.NODE_MAP.userLikeSong;
        let body = await this.request('POST', url, params, data, referer);
        return body.includes('收藏成功');
    }


    public async userLikeArtist(artistId: string, artistMid: string): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError('[QQMusicApi] Saving one artist needs to login');
        }
        let account = this.getAccount();

        let params = {
            g_tk: this.getACSRFToken(),
            loginUin: account.user.userOriginalId,
            hostUin: '0',
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'gb2312',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
            singermid: artistMid,
            rnd: Date.now(),
        };
        let referer = `https://y.qq.com/n/yqq/singer/${artistMid}.html`;
        let url = QQMusicApi.NODE_MAP.userLikeArtist;
        let json = await this.request('GET', url, params, null, referer);
        return json['code'] == 0;
    }


    public async userLikeAlbum(albumId: string, albumMid: string): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError('[QQMusicApi] Saving one album needs to login');
        }
        let account = this.getAccount();

        let params = {
            g_tk: this.getACSRFToken(),
        };
        let data = {
            loginUin: account.user.userOriginalId,
            hostUin: '0',
            format: 'fs',
            inCharset: 'GB2312',
            outCharset: 'utf8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
            g_tk: this.getACSRFToken(),
            uin: account.user.userOriginalId,
            ordertype: '1',
            albumid: albumId,
            albummid: albumMid,
            from: '1',
            optype: '1',
            utf8: '1',
        };
        let referer = 'https://imgcache.qq.com/music/miniportal_v4/tool/html/fp_utf8.html';
        let url = QQMusicApi.NODE_MAP.userLikeAlbum;
        let body = await this.request('POST', url, params, data, referer);
        return body.includes('"code":0');
    }


    public async userLikeCollection(collectionId: string, collectionMid?: string): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError('[QQMusicApi] Saving one collection needs to login');
        }
        let account = this.getAccount();

        let params = {
            g_tk: this.getACSRFToken(),
        };
        let data = {
            loginUin: account.user.userOriginalId,
            hostUin: '0',
            format: 'fs',
            inCharset: 'GB2312',
            outCharset: 'utf8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
            g_tk: this.getACSRFToken(),
            uin: account.user.userOriginalId,
            dissid: collectionId,
            from: '1',
            optype: '1',
            utf8: '1',
        };
        let referer = 'https://imgcache.qq.com/music/miniportal_v4/tool/html/fp_utf8.html';
        let url = QQMusicApi.NODE_MAP.userLikeCollection;
        let body = await this.request('POST', url, params, data, referer);
        return body.includes('"code":0');
    }


    public async userDislikeSong(songId: string, songMid?: string): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError('[QQMusicApi] Deleting one song from favorite songs list needs to login');
        }
        let account = this.getAccount();

        let params = {
            g_tk: this.getACSRFToken(),
        };
        let data = {
            loginUin: account.user.userOriginalId,
            hostUin: '0',
            format: 'fs',
            inCharset: 'GB2312',
            outCharset: 'utf8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
            g_tk: this.getACSRFToken(),
            uin: account.user.userOriginalId,
            dirid: '201',
            ids: songId,
            source: '103',
            types: '3',
            formsender: '1',
            flag: '2',
            from: '3',
            utf8: '1',
        };
        let referer = 'https://imgcache.qq.com/music/miniportal_v4/tool/html/fp_utf8.html';
        let url = QQMusicApi.NODE_MAP.userDislikeSong;
        let body = await this.request('POST', url, params, data, referer);
        return body.includes('删除成功');
    }


    public async userDislikeArtist(artist: string, artistMid: string): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError('[QQMusicApi] Deleting one artist needs to login');
        }
        let account = this.getAccount();

        let params = {
            g_tk: this.getACSRFToken(),
            loginUin: account.user.userOriginalId,
            hostUin: '0',
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'gb2312',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
            singermid: artistMid,
            rnd: Date.now(),
        };
        let referer = `https://y.qq.com/n/yqq/singer/${artistMid}.html`;
        let url = QQMusicApi.NODE_MAP.userDislikeArtist;
        let json = await this.request('GET', url, params, null, referer);
        return json['code'] == 0;
    }


    public async userDislikeAlbum(albumId: string, albumMid: string): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError('[QQMusicApi] Deleting one album needs to login');
        }
        let account = this.getAccount();

        let params = {
            g_tk: this.getACSRFToken(),
        };
        let data = {
            loginUin: account.user.userOriginalId,
            hostUin: '0',
            format: 'fs',
            inCharset: 'GB2312',
            outCharset: 'utf8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
            g_tk: this.getACSRFToken(),
            uin: account.user.userOriginalId,
            ordertype: '1',
            albumid: albumId,
            albummid: albumMid,
            from: '1',
            optype: '2',
            utf8: '1',
        };
        let referer = 'https://imgcache.qq.com/music/miniportal_v4/tool/html/fp_utf8.html';
        let url = QQMusicApi.NODE_MAP.userDislikeAlbum;
        let body = await this.request('POST', url, params, data, referer);
        return body.includes('"code":0');
    }


    public async userDislikeCollection(collectionId: string, collectionMid?: string): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError('[QQMusicApi] Deleting one collection needs to login');
        }
        let userId = this.account.user.userOriginalId;

        let params = {
            g_tk: this.getACSRFToken(),
        };
        let data = {
            loginUin: userId,
            hostUin: '0',
            format: 'fs',
            inCharset: 'GB2312',
            outCharset: 'utf8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
            g_tk: this.getACSRFToken(),
            uin: userId,
            dissid: collectionId,
            from: '1',
            optype: '2',
            utf8: '1',
        };
        let referer = 'https://imgcache.qq.com/music/miniportal_v4/tool/html/fp_utf8.html';
        let url = QQMusicApi.NODE_MAP.userDislikeCollection;
        let body = await this.request('POST', url, params, data, referer);
        return body.includes('"code":0');
    }


    public resizeImageUrl(url: string, size: ESize | number): string {
        return resizeImageUrl(url, size, (url, size) => {
            if (size <= 300) {
                return url;
            } else if (size > 300 && size <= 500) {
                return url.replace('300x300', '500x500');
            } else if (size > 500 && size <= 800) {
                return url.replace('300x300', '800x800');
            } else {
                return url.replace('300x300', '800x800');
            }
        });
    }
}


export const qqMusicApi = new QQMusicApi();
