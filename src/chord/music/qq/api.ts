'use strict';

const remote = global.electronRemote;

import * as stdFs from 'fs';
import * as stdPath from 'path';
import { CHORD_DIR } from 'chord/preference/common/chord';

import { isEmptyObject } from 'chord/base/common/objects';
import { ok } from 'chord/base/common/assert';
import { sleep } from 'chord/base/common/time';
import { IMap } from 'chord/base/common/map';
import { getRandom } from 'chord/base/node/random';
import { decodeHtml } from 'chord/base/browser/htmlContent';
import { decodeBase64 } from 'chord/base/node/crypto';

import { ORIGIN } from 'chord/music/common/origin';

import { NoLoginError, LoginTimeoutError } from 'chord/music/common/errors';

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

import { makeCookie, makeCookieJar } from 'chord/base/node/cookies';
import { querystringify } from 'chord/base/node/url';
import { request, IResponse, IRequestOptions } from 'chord/base/node/_request';

import {
    makeSong,
    makeSongs,
    makeLyric,
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

import { getSecuritySign } from 'chord/music/qq/crypto';

import { AUDIO_FORMAT_MAP } from 'chord/music/qq/parser';

import { ARTIST_LIST_OPTIONS } from 'chord/music/qq/common';
import { isObject, isString } from 'chord/base/common/checker';


const ALBUM_OPTION_NAME_MAP = {
    area: '地区',
    genre: '流派',
    type: '类别',
    year: '年代',
    company: '唱片公司',
};


export class QQMusicApi {

    static readonly HEADERS = {
        'accept-encoding': 'gzip, deflate',
        'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,ja;q=0.6,zh-TW;q=0.5',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
        'accept': '*/*',
    };

    // static readonly AUDIO_URI = 'http://mobileoc.music.tc.qq.com/';
    // static readonly AUDIO_URI = 'http://streamoc.music.tc.qq.com/';
    // static readonly AUDIO_URI = 'http://223.111.154.151/amobile.music.tc.qq.com/';
    // static readonly AUDIO_URI = 'http://dl.stream.qqmusic.qq.com/';
    static readonly AUDIO_URI = 'http://isure.stream.qqmusic.qq.com/';

    static readonly NODE_MAP = {
        // qqKey: 'https://c.y.qq.com/base/fcgi-bin/fcg_musicexpress.fcg',
        qqKey: 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
        audio: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        song: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        // lyric: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_yqq.fcg',
        lyric: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
        album: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg',

        artist: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_detail_cp.fcg',
        artistLikeCount: 'https://c.y.qq.com/rsc/fcgi-bin/fcg_order_singer_getnum.fcg',
        // artistSongs: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
        artistSongs: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        // artistAlbums: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        artistAlbums: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_album.fcg',

        collection: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
        collectionAddons: 'https://c.y.qq.com/3gmusic/fcgi-bin/3g_dir_order_uinlist',

        // search: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        search: 'http://c.y.qq.com/soso/fcgi-bin/client_search_cp',
        searchCollections: 'https://c.y.qq.com/soso/fcgi-bin/client_music_search_songlist',

        songList: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        albumList: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        collectionList: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
        artistList: 'https://u.y.qq.com/cgi-bin/musicu.fcg',

        collectionListOptions: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg',

        userProfile: 'https://c.y.qq.com/rsc/fcgi-bin/fcg_get_profile_homepage.fcg',

        userFavoriteSongs: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
        userFavoriteAlbums: 'https://c.y.qq.com/fav/fcgi-bin/fcg_get_profile_order_asset.fcg',
        userFavoriteArtists: 'https://c.y.qq.com/rsc/fcgi-bin/fcg_order_singer_getlist.fcg',
        userFavoriteCollections: 'https://c.y.qq.com/fav/fcgi-bin/fcg_get_profile_order_asset.fcg',
        userCreatedCollections: 'https://c.y.qq.com/rsc/fcgi-bin/fcg_user_created_diss',
        userFollow: 'https://c.y.qq.com/rsc/fcgi-bin/friend_follow_or_listen_list.fcg',

        myCreatedCollections: 'https://c.y.qq.com/splcloud/fcgi-bin/songlist_list.fcg',
        userLikeSong: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_music_add2songdir.fcg',
        userLikeArtist: 'https://c.y.qq.com/rsc/fcgi-bin/fcg_order_singer_add.fcg',
        userLikeAlbum: 'https://c.y.qq.com/folder/fcgi-bin/fcg_qm_order_diss.fcg',
        userLikeCollection: 'https://c.y.qq.com/folder/fcgi-bin/fcg_qm_order_diss.fcg',
        userLikeUserProfile: 'https://c.y.qq.com/rsc/fcgi-bin/add_attention_status.fcg',

        userDislikeSong: 'https://c.y.qq.com/qzone/fcg-bin/fcg_music_delbatchsong.fcg',
        userDislikeArtist: 'https://c.y.qq.com/rsc/fcgi-bin/fcg_order_singer_del.fcg',
        userDislikeAlbum: 'https://c.y.qq.com/folder/fcgi-bin/fcg_qm_order_diss.fcg',
        userDislikeCollection: 'https://c.y.qq.com/folder/fcgi-bin/fcg_qm_order_diss.fcg',
        userDislikeUserProfile: 'https://c.y.qq.com/rsc/fcgi-bin/add_attention_status.fcg',

        recommendCollections: 'https://u.y.qq.com/cgi-bin/musicu.fcg',

        newSongs: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        newAlbums: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        newCollections: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',

        playLog: 'https://c.y.qq.com/tplcloud/fcgi-bin/fcg_reportlsting_web.fcg',
    };

    private account: IAccount;
    private cookies: IMap<string>;

    // The cookies are for getting audio url.
    // They can be these cookies of a vip user.
    private cookiesForAudio: IMap<string>;

    private ip_index: number;
    private ips: Array<string>;


    constructor() {
        this.cookies = {};
        this.ip_index = -1;
        this.ips = [];

        try {
            let cookiesForAudioPath = stdPath.join(CHORD_DIR, 'cookies-for-audio.json');
            let cookiesForAudio = JSON.parse(stdFs.readFileSync(cookiesForAudioPath).toString());
            this.cookiesForAudio = cookiesForAudio[ORIGIN.qq] || this.cookies;
        } catch {
            this.cookiesForAudio = this.cookies;
        }
    }


    private getACSRFToken(): string {
        return this.account ? getACSRFToken(this.account.cookies) : null;
    }


    public async request(
        method: string,
        url: string,
        params?: any,
        data?: any,
        referer?: string,
        cookies: Object = {}): Promise<any> {
        if (params) {
            url = url + '?' + querystringify(params);
        }

        referer = referer || 'https://y.qq.com';
        let headers = { ...QQMusicApi.HEADERS, referer };

        // Here, domains are different. Make a new CookieJar for a request.
        if (isEmptyObject(cookies)) {
            cookies = this.cookies;
        }
        let jar = makeCookieJar();
        for (let k of Object.keys(cookies)) {
            let cookie = makeCookie(k, cookies[k]);
            jar.setCookie(cookie, url);
        }

        let options: IRequestOptions = {
            method,
            jar,
            headers: headers,
            data,
        };

        let resp: IResponse = await request(url, options);
        return resp.data;
    }


    public makeguid(): string {
        // return '0';
        return Math.floor(Math.random() * 1000000000).toString();
    }


    // Deprecated. Do not use it
    // This api has been blocked.
    public async qqKey2(guid: string, songMid: string, songMediaMid: string): Promise<string> {
        let params = {
            cid: '205361747',
            guid: guid,
            songmid: songMid,
            filename: 'M500' + songMediaMid + '.mp3',
            format: 'json',
            '_': Date.now(),
        };
        let url = QQMusicApi.NODE_MAP.qqKey;
        let json = await this.request('GET', url, params);
        return json['data']['items'][0]['vkey'];
    }


    // Deprecated. Do not use it
    public async qqKey(guid: string, songMid: string, songMediaMid: string): Promise<string> {
        let data = JSON.stringify({
            'req': {
                'module': 'vkey.GetVkeyServer',
                'method': 'CgiGetVkey',
                'param': {
                    guid,
                    'songmid': [songMid],
                    'songtype': [0],
                    'uin': '0',
                    'loginflag': 1,
                    'platform': '20'
                }
            },
            'comm': { 'uin': 0, 'format': 'json', 'ct': 24, 'cv': 0 }
        });
        let sign = getSecuritySign(data);
        let params = {
            g_tk: '5381',
            sign,
            loginUin: '0',
            hostUin: '0',
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'yqq.json',
            needNewCode: '0',
            data,
        };
        let url = QQMusicApi.NODE_MAP.qqKey;
        let json = await this.request('GET', url, params);
        return json.req.data.midurlinfo[0].vkey;
    }


    /**
     * Uin is important for get audio url
     */
    private getUinForAudio(): string {
        let uin = this.cookiesForAudio['uin'] || (this.account && this.account.user && this.account.user.userOriginalId);
        return uin || '';
    }


    // Deprecated
    private getAudioServerIP(): string {
        this.ip_index = (this.ip_index + 1) % this.ips.length;
        return this.ips[this.ip_index];
    }


    // Deprecated
    private getAudioURI(): string {
        let ip = this.getAudioServerIP();
        return 'http://' + ip + '/amobile.music.tc.qq.com/';
    }


    // Deprecated
    public makeAudios(song: ISong, qqKey: string, guid: string): Array<IAudio> {
        if (!qqKey) return [];

        let uri = QQMusicApi.AUDIO_URI;
        return song.audios.filter(audio => !!AUDIO_FORMAT_MAP[`${audio.kbps || ''}${audio.format}`])
            .map(audio => {
                audio.url = uri
                    + AUDIO_FORMAT_MAP[`${audio.kbps || ''}${audio.format}`]
                    + song.songMediaMid + '.' + audio.format
                    + '?guid=' + guid
                    + '&vkey=' + qqKey
                    + '&uin=0'
                    + '&fromtag=66';
                return audio;
            });
    }


    // Deprecated
    /**
     * Get available qq music server ips
     */
    public async getIPs(): Promise<Array<string>> {
        let url = 'https://raw.githubusercontent.com/PeterDing/chord-data/master/qq-ip-checker/qq-ips.txt';
        let resp: IResponse = await request(url);
        let body = resp.data;
        let ips = body.split('\n').map(ip => ip.trim() || null).filter(ip => ip);
        return ips;
    }


    /**
     * Get audio url
     */
    public async getAudioUrl(songMid: string, songMediaMid: string, kbps: number, format: string): Promise<string> {
        let guid = this.makeguid();
        let uin = this.getUinForAudio();

        if (!(AUDIO_FORMAT_MAP[`${kbps || ''}${format}`])) {
            return null;
        }

        let filename = AUDIO_FORMAT_MAP[`${kbps || ''}${format}`] + songMediaMid + '.' + format;

        let data = JSON.stringify({
            'req_0': {
                'module': 'vkey.GetVkeyServer',
                'method': 'CgiGetVkey',
                'param': {
                    'filename': [filename],
                    guid,
                    'songmid': [songMid],
                    'songtype': [0],
                    uin,
                    'loginflag': 1,
                    'platform': '20',
                }
            },
            'comm': {
                uin,
                'format': 'json',
                'ct': 24,
                'cv': 0
            }
        });
        let sign = getSecuritySign(data);
        let params = {
            sign,
            g_tk: 5381,
            loginUin: '',
            hostUin: 0,
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8¬ice=0',
            platform: 'yqq.json',
            needNewCode: 0,
            data,
        };
        let url = QQMusicApi.NODE_MAP.audio;
        let json = await this.request('GET', url, params, null, null, this.cookiesForAudio);
        let audioUri = json.req_0.data.midurlinfo[0].purl;
        if (audioUri) {
            return QQMusicApi.AUDIO_URI + audioUri;
        } else {
            return null;
        }
    }


    public async audios(songId: string, supKbps?: number): Promise<Array<IAudio>> {
        let song = await this.song(songId);
        let { songMid, songMediaMid } = song;
        let audios = song.audios;

        for (let audio of audios) {
            let { kbps, format } = audio;
            if (audio.kbps <= supKbps) {
                let audioUrl = await this.getAudioUrl(songMid, songMediaMid, kbps, format);
                if (audioUrl) {
                    audio.url = audioUrl;
                    break;
                }
            }
        }

        return audios;
    }


    public async song(songId: string, songMid?: string): Promise<ISong> {
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
                    "song_id": songId ? parseInt(songId) : undefined,
                    "song_mid": songMid || undefined,
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


    public async lyric(songId: string, songMid: string): Promise<ILyric> {
        let params = {
            '-': 'MusicJsonCallback_lrc',
            pcachetime: Date.now(),
            songmid: songMid,
            g_tk: 5381,
            loginUin: 0,
            hostUin: 0,
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq.json',
            needNewCode: 0,
        };
        let url = QQMusicApi.NODE_MAP.lyric;
        let referer = 'https://y.qq.com/portal/player.html';
        let json = await this.request('GET', url, params, null, referer);
        let lyricInfo = decodeHtml(decodeBase64(json['lyric']));
        let transInfo = decodeHtml(decodeBase64(json['trans']));
        return makeLyric(songId, lyricInfo, transInfo);
    }


    public async album(albumId: string, albumMid?: string): Promise<IAlbum> {
        let params = {
            albumid: albumId || undefined,
            albummid: albumMid || undefined,
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


    public async artist(artistId: string, artistMid?: string): Promise<IArtist> {
        let params = {
            newsong: 1,
            tpl: 'wk',
            singerid: artistId,
            singermid: artistMid,
            g_tk: 5381,
            platform: 'mac',
            g_tk_new_20200303: 5381,
            loginUin: 0,
            hostUin: 0,
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            needNewCode: 0,
            ct: 6,
            cv: 10000,
        };
        let url = QQMusicApi.NODE_MAP.artist;
        let json = await this.request('GET', url, params);
        let artist = makeArtist(json);
        let likeCount = await this.artistLikeCount(artist.artistMid);
        artist.likeCount = likeCount;
        return artist;
    }


    public async artistSongs(artistMid: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let data = JSON.stringify({
            "req_0": {
                "module": "musichall.song_list_server",
                "method": "GetSingerSongList",
                "param": {
                    "singerMid": artistMid,
                    "begin": offset,
                    "num": limit,
                    "order": 0,
                }
            },
        });
        let params = { data };
        let url = QQMusicApi.NODE_MAP.artistSongs;
        let json = await this.request('GET', url, params);
        return makeSongs(json['req_0']['data']['songList']);
    }


    /**
     * WARN: `artistMid`
     */
    public async artistAlbums(artistMid: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let params = {
            platform: 'mac',
            singermid: artistMid,
            order: 0, // @param order 排序 time 时间 listen 热度
            begin: offset,
            num: limit,
            g_tk_new_20200303: 5381,
            g_tk: 5381,
            loginUin: 0,
            hostUin: 0,
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            type: 0, // @param type 分类，不传为全部，0录音室专辑，11 EP单曲，1 现场专辑
        };
        let url = QQMusicApi.NODE_MAP.artistAlbums;
        let json = await this.request('GET', url, params);
        return makeAlbums(json['data']['list']);
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


    /**
     * Search
     *
     * @param type: number
     *      0: song
     *      2: collection
     *      8: album
     *      9: artist
     */
    public async search(type: number, keyword: string, offset: number = 0, limit: number = 10): Promise<any> {
        let params = type == 2 ? {
            remoteplace: 'txt.yqq.playlist',
            page_no: offset,
            num_per_page: limit,
            query: keyword,
        } : {
            format: 'json',
            n: limit,
            p: offset,
            w: keyword,
            cr: '1',
            g_tk: '5381',
            t: type,
        };
        let url = type == 2 ? QQMusicApi.NODE_MAP.searchCollections : QQMusicApi.NODE_MAP.search;
        let json = await this.request('GET', url, params);
        return json;
    }


    public async searchSongs(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let json = await this.search(0, keyword, offset, limit);
        return makeSongs(json['data']['song'] && json['data']['song']['list'] || []);
    }


    public async searchArtists(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IArtist>> {
        let json = await this.search(9, keyword, offset, limit);
        return makeArtists(json['data']['singer'] && json['data']['singer']['list'] || []);
    }


    public async searchAlbums(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let json = await this.search(8, keyword, offset, limit);
        return makeAlbums(json['data']['album'] && json['data']['album']['list'] || []);
    }


    public async searchCollections(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let body = await this.search(2, keyword, offset, limit);
        let json = JSON.parse(body.slice(18, -1));
        return makeCollections(json['data'] && json['data']['list'] || []);
    }


    /**
     * Get new songs
     *
     * languageId:
     *     1: 内地
     *     2: 港台
     *     3: 欧美
     *     4: 日本
     *     5: 韩国
     */
    public async songList(languageId: number = 1, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let params = {
            g_tk: 0,
            loginUin: 0,
            hostUin: 0,
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq.json',
            needNewCode: 0,
            data: JSON.stringify({
                comm: { ct: 24 },
                new_song: {
                    method: "GetNewSong",
                    module: "QQMusic.MusichallServer",
                    param: {
                        type: languageId,
                    }
                },
            }),
        };
        let url = QQMusicApi.NODE_MAP.songList;
        let json = await this.request('GET', url, params);
        return makeSongs(json['new_song']['data']['song_list']);
    }


    public async albumListOptions(): Promise<Array<IListOption>> {
        let params = {
            g_tk: 0,
            loginUin: 0,
            hostUin: 0,
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq.json',
            needNewCode: 0,
            data: JSON.stringify({
                comm: { ct: 24 },
                albumlib: {
                    param: {
                        get_tags: 1,
                        click_albumid: 0,
                        year: -1,
                        genre: -1,
                        area: 1,
                        sort: 2,
                        type: -1,
                        sin: 0,
                        num: 1,
                        company: -1
                    },
                    method: 'get_album_by_tags',
                    module: 'music.web_album_library',
                },
            }),
        };
        let url = QQMusicApi.NODE_MAP.songList;
        let json = await this.request('GET', url, params);
        let tags = json['albumlib']['data']['tags'];
        let options = Object.keys(tags).map(key => ({
            name: ALBUM_OPTION_NAME_MAP[key],
            type: key,
            items: tags[key].map(info => ({
                id: info['id'],
                name: info['name'],
            })),
        }));
        let sortOption = {
            name: '排序',
            type: 'sort',
            items: [
                { id: 2, name: '最新' },
                { id: 5, name: '最热' },
            ],
        };
        options.push(sortOption);
        return options;
    }


    /**
     * sort:
     *     2: 最新
     *     5: 最热
     *
     * area: 地区  // 同 xiami 的语种
     * genre: 流派  // 同 xiami 的曲风
     * type: 类别  // album 类别
     * year: 年代
     * company: 唱片公司
     */
    public async albumList(
        sort: number = 5,
        areaId: number = 0,
        genreId: number = -1,
        typeId: number = -1,
        yearId: number = -1,
        companyId: number = -1,
        offset: number = 0,
        limit: number = 10): Promise<Array<IAlbum>> {

        let params = {
            g_tk: 0,
            loginUin: 0,
            hostUin: 0,
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq.json',
            needNewCode: 0,
            data: JSON.stringify({
                comm: { ct: 24 },
                albumlib: {
                    param: {
                        get_tags: 0,
                        click_albumid: 0,
                        sort: sort,
                        area: areaId,
                        genre: genreId,
                        type: typeId,
                        year: yearId,
                        company: companyId,
                        sin: offset,
                        num: limit,
                    },
                    method: 'get_album_by_tags',
                    module: 'music.web_album_library',
                },
            }),
        };
        let url = QQMusicApi.NODE_MAP.albumList;
        let json = await this.request('GET', url, params);
        return makeAlbums(json['albumlib']['data']['list']);
    }


    public collectionListOrders(): Array<{ name: string, id: string }> {
        return [
            { id: '3', name: '最热' },
            { id: '2', name: '最新' },
            { id: '4', name: '评分' },
        ];
    }


    public async collectionListOptions(): Promise<Array<IListOption>> {
        let params = {
            g_tk: 0,
            loginUin: 0,
            hostUin: 0,
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq.json',
            needNewCode: 0,
        };
        let url = QQMusicApi.NODE_MAP.collectionListOptions;
        let json = await this.request('GET', url, params);
        let options = json['data']['categories'].map(info => ({
            name: info['categoryGroupName'],
            type: 'category',
            items: info['items'].map(item => ({
                id: item['categoryId'],
                name: item['categoryName'],
            })),
        }));
        return options;
    }


    /**
     * sort:
     *     2: 最新
     *     3: 最热
     *     4: 评分
     *
     *  categoryId sees this.collectionListOptions
     */
    public async collectionList(sort: number | string = 3, categoryId: number | string = 10000000, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let params = {
            picmid: 1,
            rnd: getRandom(),
            g_tk: 0,
            loginUin: 0,
            hostUin: 0,
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq.json',
            needNewCode: 0,
            categoryId: categoryId,
            sortId: sort,
            sin: offset,
            ein: limit,
        };
        let url = QQMusicApi.NODE_MAP.collectionList;
        let json = await this.request('GET', url, params);
        return makeCollections(json['data']['list']);
    }


    public async artistListOptions(): Promise<Array<IListOption>> {
        return ARTIST_LIST_OPTIONS;
    }


    /**
     * Get artists by options
     *
     * return 80 artists, default
     *
     * @param offset is just offset
     * @param limit is page number
     */
    public async artistList(
        area: string = '-100',
        genre: string = '-100',
        sex: string = '-100',
        index: string = '-100',
        offset: number = 0,
        limit: number = 1): Promise<Array<IArtist>> {
        let data = JSON.stringify({
            comm: {
                ct: 24,
                cv: 0,
            },
            singerList: {
                module: "Music.SingerListServer",
                method: "get_singer_list",
                param: {
                    area: Number.parseInt(area),
                    genre: Number.parseInt(genre),
                    sex: Number.parseInt(sex),
                    index: Number.parseInt(index),
                    sin: offset,
                    cur_page: 1,
                }
            }
        });
        let params = {
            g_tk: 5381,
            loginUin: 0,
            hostUin: 0,
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq.json',
            needNewCode: 0,
            data,
        };
        let url = QQMusicApi.NODE_MAP.artistList;
        let json = await this.request('GET', url, params);
        return makeArtists(json['singerList']['data']['singerlist']);
    }


    public async newSongs(offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let songLists = await Promise.all([
            this.songList(1),
            this.songList(2),
            this.songList(3),
            this.songList(4),
            this.songList(5),
        ]);
        let songs = [];
        for (let i of Array(10).keys()) {
            for (let j of Array(5).keys()) {
                let song = songLists[j][i];
                if (song) songs.push(song);
            }
        }
        return songs;
    }


    public async newAlbums(offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let albumLists = await Promise.all([
            this.albumList(2, 1, -1, -1, -1, -1, 0, 5),
            this.albumList(2, 0, -1, -1, -1, -1, 0, 5),
            this.albumList(2, 3, -1, -1, -1, -1, 0, 5),
            this.albumList(2, 15, -1, -1, -1, -1, 0, 5),
            this.albumList(2, 14, -1, -1, -1, -1, 0, 5),
        ]);
        let albums = [];
        for (let i of Array(5).keys()) {
            for (let j of Array(5).keys()) {
                let album = albumLists[j][i];
                if (album) albums.push(album);
            }
        }
        return albums;
    }


    public async newCollections(offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        return this.collectionList(2, 10000000, offset, limit);
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
                await sleep(2000);
                let cookies = {};
                cookiesStr.split('; ').forEach(chunk => {
                    let index = chunk.indexOf('=');
                    cookies[chunk.slice(0, index)] = chunk.slice(index + 1);
                });

                // get user profile
                let userOriginalId = cookies['uin'] || cookies['luin'] || cookies['p_uin'];
                if (userOriginalId.startsWith('o0')) {
                    userOriginalId = userOriginalId.slice(2);
                }

                let tmpApi = new QQMusicApi();
                tmpApi.cookies = cookies;

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

        this.cookies = { ...account.cookies };
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


    // TODO: Fix: {"code":1006,"subcode":1006,"msg":"g_token is wrong"}
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
        let collections = makeCollections(
            (offset == 0 ? json.data.disslist.slice(1) : json.data.disslist)
                .filter(info => info.tid != 0)
        );
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


    public async myCreatedCollections(): Promise<Array<{ id: string; name: string }>> {
        if (!this.logined()) {
            throw new NoLoginError('[QQMusicApi] Saving one song to favorite songs list needs to login');
        }
        let account = this.getAccount();

        let params = {
            g_tk: this.getACSRFToken(),
            utf8: '1',
            uin: account.user.userOriginalId,
            loginUin: account.user.userOriginalId,
            hostUin: '0',
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
        };

        let url = QQMusicApi.NODE_MAP.myCreatedCollections;
        let json = await this.request('GET', url, params);
        return json.list.map(item => {
            return { id: item['dirid'].toString(), name: item['dirname'].trim() };
        });
    }


    public async userLikeSong(songId: string, songMid: string): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError('[QQMusicApi] Saving one song to favorite songs list needs to login');
        }
        let account = this.getAccount();

        let params = {
            g_tk: this.getACSRFToken(),
        };
        let data = querystringify({
            loginUin: account.user.userOriginalId,
            hostUin: '0',
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'yqq.post',
            needNewCode: '0',
            uin: account.user.userOriginalId,
            midlist: songMid,
            typelist: '13',
            dirid: '201',
            addtype: '',
            formsender: '4',
            source: '153',
            r2: '0',
            r3: '1',
            utf8: '1',
            g_tk: this.getACSRFToken(),
        });
        let referer = 'https://imgcache.qq.com/music/miniportal_v4/tool/html/fp_utf8.html';
        let url = QQMusicApi.NODE_MAP.userLikeSong;
        let json = await this.request('POST', url, params, data, referer);
        return json.code == 0;
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
        let data = querystringify({
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
        });
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
        let data = querystringify({
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
        });
        let referer = 'https://imgcache.qq.com/music/miniportal_v4/tool/html/fp_utf8.html';
        let url = QQMusicApi.NODE_MAP.userLikeCollection;
        let body = await this.request('POST', url, params, data, referer);
        return body.includes('"code":0');
    }


    public async userLikeUserProfile(userId: string, userMid?: string, dislike: boolean = false): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError('[QQMusicApi] following/unfollowing one user needs to login');
        }
        let account = this.getAccount();

        let params = {
            g_tk: this.getACSRFToken(),
        };
        let data = querystringify({
            loginUin: account.user.userOriginalId,
            hostUin: '0',
            format: 'fs',
            inCharset: 'GB2312',
            outCharset: 'utf8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
            g_tk: this.getACSRFToken(),
            my_uin: account.user.userOriginalId,
            friend_uin: userId,
            status: dislike ? '0' : '1',
            formsender: '1',
        });
        let referer = 'https://imgcache.qq.com/music/miniportal_v4/tool/html/fp_gbk.html';
        let url = QQMusicApi.NODE_MAP.userLikeUserProfile;
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
        let data = querystringify({
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
        });
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
        let data = querystringify({
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
        });
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
        let data = querystringify({
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
        });
        let referer = 'https://imgcache.qq.com/music/miniportal_v4/tool/html/fp_utf8.html';
        let url = QQMusicApi.NODE_MAP.userDislikeCollection;
        let body = await this.request('POST', url, params, data, referer);
        return body.includes('"code":0');
    }


    public async userDislikeUserProfile(userId: string, userMid?: string): Promise<boolean> {
        return this.userLikeUserProfile(userId, userMid, true);
    }


    /**
     * QQ has not recommended songs
     */
    public async recommendSongs(offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        return [];
    }


    public async recommendCollections(offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let data = JSON.stringify(
            {
                recomPlaylist: {
                    module: "playlist.HotRecommendServer",
                    method: "get_hot_recommend",
                    param: {
                        cmd: 2,
                        async: 1
                    }
                },
            }
        );
        let params = {
            g_tk: this.getACSRFToken(),
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
        let url = QQMusicApi.NODE_MAP.recommendCollections;
        let json = await this.request('GET', url, params);
        return makeCollections(json['recomPlaylist']['data']['v_hot'] || []);
    }


    /**
     * QQ seems has not the api
     */
    public async playLog(songId: string, seek: number, songMid?: string): Promise<boolean> {
        if (!this.logined()) {
            throw new NoLoginError('[QQMusicApi] recording one played song needs to login');
        }

        let params = {
            musicid: songId,
            isexit: 'false',
            _r: Date.now(),
            g_tk: this.getACSRFToken(),
        };
        let referer = 'https://y.qq.com/portal/player.html';
        let url = QQMusicApi.NODE_MAP.playLog;

        // return nothing;
        await this.request('GET', url, params, null, referer);
        return true;
    }


    public resizeImageUrl(url: string, size: ESize | number): string {
        return resizeImageUrl(url, size, (url: string, size) => {
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


    public changeIP(audioUrl: string): string {
        let re = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
        let mod = re.exec(audioUrl);
        if (!!!mod) {
            let newURI = this.getAudioURI();
            return audioUrl.replace(QQMusicApi.AUDIO_URI, newURI);
        }

        let ip = mod[0];
        // remove invalid ip
        this.ips = [
            ...this.ips.slice(0, this.ip_index),
            ...this.ips.slice(this.ip_index + 1)
        ];
        this.ip_index -= 1;
        let newIP = this.getAudioServerIP();
        return audioUrl.replace(ip, newIP);
    }


    public async fromURL(input: string): Promise<Array<TMusicItems>> {
        let chunks = input.split(' ');
        let items = [];
        for (let chunk of chunks) {
            let m;
            let mid;
            let originId;
            let type;

            let matchList = [
                // song
                [/songmid=([^/#&.]+)/, 'song', 'mid'],
                [/songid=(\d+)/, 'song', 'originId'],
                [/song\/(\d+)_num/, 'song', 'originId'],
                [/song\/([^/#&.]+)/, 'song', 'mid'],

                // singer
                [/singerid=(\d+)/, 'artist', 'originId'],
                [/singermid=([^/#&.]+)/, 'artist', 'mid'],
                [/singer\/([^/#&.]+)/, 'artist', 'mid'],

                // album
                [/album\/(\d+)_num/, 'album', 'originId'],
                [/albumId=(\d+)/, 'album', 'originId'],
                [/album\/([^/#&.]+)/, 'album', 'mid'],

                // collection
                [/taoge\/.+?&id=(\d+)/, 'collection', 'originId'],
                [/playlist\/(\d+)/, 'collection', 'originId'],
                [/playsquare\/([^/#&.]+)/, 'collection', 'originId'],

                // user
                [/profile\.html\?uin=([^/#&.]+)/, 'user', 'originId'],
            ];
            for (let [re, tp, idType] of matchList) {
                m = (re as RegExp).exec(chunk);
                if (m) {
                    if (idType == 'mid') {
                        mid = m[1];
                        originId = null;
                        type = tp;
                    } else {
                        mid = null;
                        originId = m[1];
                        type = tp;
                    }
                    break;
                }
            }

            if (mid || originId) {
                let item;
                switch (type) {
                    case 'song':
                        item = await this.song(originId, mid);
                        items.push(item);
                        break;
                    case 'artist':
                        item = await this.artist(originId, mid);
                        items.push(item);
                        break;
                    case 'album':
                        item = await this.album(originId, mid);
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
