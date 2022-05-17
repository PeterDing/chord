'use strict';

import * as cheerio from 'cheerio';
import { decodeHtml } from 'chord/base/browser/htmlContent';

import { ISong } from "chord/music/api/song";
import { ILyric } from 'chord/music/api/lyric';
import { IAlbum } from "chord/music/api/album";
import { IArtist } from "chord/music/api/artist";
import { ICollection } from "chord/music/api/collection";
import { IAudio } from "chord/music/api/audio";

import { IUserProfile } from "chord/music/api/user";

import {
    getSongUrl,
    getAlbumUrl,
    getArtistUrl,
    getCollectionUrl,
    getUserUrl,
    getSongId,
    getAlbumId,
    getArtistId,
    getCollectionId,
    getUserId,
} from "chord/music/common/origin";

import { makeLyric as _makeLyric } from 'chord/music/utils/lyric';


const _origin = 'kuwo';

const _getSongUrl: (id: string) => string = getSongUrl.bind(null, _origin);
const _getSongId: (id: string) => string = getSongId.bind(null, _origin);
const _getAlbumUrl: (id: string) => string = getAlbumUrl.bind(null, _origin);
const _getAlbumId: (id: string) => string = getAlbumId.bind(null, _origin);
const _getArtistUrl: (id: string) => string = getArtistUrl.bind(null, _origin);
const _getArtistId: (id: string) => string = getArtistId.bind(null, _origin);
const _getCollectionUrl: (id: string) => string = getCollectionUrl.bind(null, _origin);
const _getCollectionId: (id: string) => string = getCollectionId.bind(null, _origin);
const _getUserUrl: (id: string) => string = getUserUrl.bind(null, _origin);
const _getUserId: (id: string) => string = getUserId.bind(null, _origin);


export function makeAudio(info: any): IAudio {
    if (!info['url']) return null;
    return {
        format: info['type'],
        size: info['size'],
        kbps: Math.floor(info['br'] / 1000),
        url: info['url'],
        path: null,
    };
}

export function makeSong(info: any): ISong {
    let songOriginalId = info['rid'].toString();

    let albumOriginalId = info['albumid'].toString();
    let albumCoverUrl = info['albumpic'].replace('.kwcdn.', '.');

    let artistOriginalId = info['artistid'].toString();

    let disable = info['online'] != 1;

    let song: ISong = {
        songId: _getSongId(songOriginalId),

        type: 'song',
        origin: _origin,

        songOriginalId,

        url: _getSongUrl(songOriginalId),

        songName: decodeHtml(info['name']),

        albumId: _getAlbumId(albumOriginalId),
        albumOriginalId,
        albumName: decodeHtml(info['album']),
        albumCoverUrl,

        artistId: _getArtistId(artistOriginalId),
        artistOriginalId,
        artistName: decodeHtml(info['artist']),

        track: info['track'],

        // millisecond
        duration: info['duration'] * 1000,

        description: info['albuminfo'],

        // millisecond
        releaseDate: Date.parse(info['releaseDate']),

        playCount: 0,

        audios: [],

        disable,
    };
    return song;
}

export function makeSongs(info: any): Array<ISong> {
    return (info || []).map(songInfo => makeSong(songInfo));
}

export function makeLyric(songId: string, lyricInfo: any): ILyric {
    if (!lyricInfo || lyricInfo.length == 0) return null;

    let hasTrans = false;
    let transStart = 0;
    let [a1, a2, e] = lyricInfo.slice(lyricInfo.length - 3, lyricInfo.length);
    if (a1.time == a2.time) {
        hasTrans = true;
        for (let i = 0; i < lyricInfo.length - 1; ++i) {
            if (lyricInfo[i].lineLyric.startsWith('/') || lyricInfo[i].lineLyric.startsWith('/')) {
                continue;
            }
            if (lyricInfo[i].time == lyricInfo[i + 1].time) {
                transStart = i - 1;
                break;
            }
        }
    }

    let chunks = [];
    if (!hasTrans) {
        chunks = lyricInfo.map(item => ({
            type: 'lyric',
            text: item.lineLyric,
            point: Number.parseFloat(item.time) * 1000,
            translation: null,
        }));
    } else {
        lyricInfo.slice(0, transStart).forEach(item => {
            chunks.push({
                type: 'lyric',
                text: item.lineLyric,
                point: Number.parseFloat(item.time) * 1000,
                translation: null,
            });
        });

        for (let i = 0; i <= (lyricInfo.length - transStart - 1) / 2; ++i) {
            let start = i * 2 + transStart;
            let end = i * 2 + transStart + 2;
            let [ori, trans] = lyricInfo.slice(start, end);
            chunks.push({
                type: 'lyric',
                text: ori.lineLyric,
                point: Number.parseFloat(trans.time) * 1000,
                translation: trans.lineLyric,
            });
        }
    }

    let lyric = {
        songId: _getSongId(songId),
        chunks,
    }
    return lyric;
}

export function makeAlbum(info: any): IAlbum {
    let albumOriginalId = info['albumid'].toString();
    let albumCoverUrl = info['pic'].replace('.kwcdn.', '.');

    let artistOriginalId = info['artistid'].toString();

    let songs = (info['musicList'] || []).map(songInfo => makeSong(songInfo));

    let album: IAlbum = {
        albumId: _getAlbumId(albumOriginalId),

        type: 'album',
        origin: _origin,
        albumOriginalId: albumOriginalId,
        url: _getAlbumUrl(albumOriginalId),

        albumName: decodeHtml(info['album']),
        albumCoverUrl: albumCoverUrl,

        artistId: _getArtistId(artistOriginalId),
        artistOriginalId,
        artistName: decodeHtml(info['artist']),

        description: info['albuminfo'] || null,

        releaseDate: Date.parse(info['releaseDate']),

        songs: songs,
        songCount: info['total'],
    };
    return album;
}

export function makeAlbums(info: any): Array<IAlbum> {
    return (info || []).map(albumInfo => makeAlbum(albumInfo));
}

export function makeCollection(info: any): ICollection {
    let collectionOriginalId = info['id'].toString();
    let collectionCoverUrl = info['img300'];

    let tags = (info['tag'] || '').split(',').map(tag => ({ name: tag }));

    let songs = (info['musicList'] || []).map(songInfo => makeSong(songInfo));

    let userOriginalId = info['uname'];
    let userName = decodeHtml(info['userName']);

    let collection: ICollection = {
        collectionId: _getCollectionId(collectionOriginalId),

        type: 'collection',
        origin: _origin,
        collectionOriginalId,
        url: _getCollectionUrl(collectionOriginalId),

        collectionName: decodeHtml(info['name']),

        collectionCoverUrl,

        userId: _getUserId(userOriginalId),
        userName,

        releaseDate: null,

        description: info['info'],

        tags,

        songs,
        songCount: info['total'],

        playCount: info['listencnt'],
    };
    return collection;
}

export function makeCollections(info: any): Array<ICollection> {
    return (info || []).map(collectionInfo => makeCollection(collectionInfo));
}

export function makeArtist(info: any): IArtist {
    let artistOriginalId = info['id'].toString();
    let artistAvatarUrl = info['pic'];

    let artist: IArtist = {
        artistId: _getArtistId(artistOriginalId),
        type: 'artist',
        origin: _origin,
        artistOriginalId: artistOriginalId,
        url: _getArtistUrl(artistOriginalId),

        artistName: decodeHtml(info['name']),
        // artistAlias: artistAlias,

        artistAvatarUrl: artistAvatarUrl,

        description: info['info'],

        songs: [],
        albums: [],

        playCount: info['playCount'],
    };
    return artist;
}

export function makeArtists(info: any): Array<IArtist> {
    return (info || []).map(artistInfo => makeArtist(artistInfo));
}

export function makeArtistAlbums(info: any): Array<IAlbum> {
    return (info['hotAlbums'] || []).map(albumInfo => makeAlbum(albumInfo));
}

export function makeUserProfile(info: any, userId?: string): IUserProfile {
    let userOriginalId = userId || info['userId'].toString();
    let user = {
        userId: _getUserId(userOriginalId),

        type: 'userProfile',

        origin: _origin,

        userOriginalId,

        url: _getUserUrl(userOriginalId),

        userName: decodeHtml(info['nickname']),

        userAvatarUrl: info['avatarImg'] || info['avatarUrl'],
        listenCount: info['playCount'],

        followingCount: info['follows'],
        followerCount: info['followeds'],

        favoriteCollectionCount: info['playlistCount'],

        description: info['signature'],
    }
    return user;
}

export function makeUserProfiles(info: any): Array<IUserProfile> {
    return (info || []).map(userProfile => makeUserProfile(userProfile));
}

export function getInfosFromHtml(html: string): any {
    let $ = cheerio.load(html);
    let userOriginalId = /window.hostId\s*=\s*(\d+)/.exec(html)[1];
    let info = {
        userId: _getUserId(userOriginalId),
        followingCount: parseInt($('#follow_count').text().trim()),
        followerCount: parseInt($('#fan_count').text().trim()),
        favoriteCollectionCount: parseInt(/cCount\s*:\s*(\d+)/g.exec(html)[1]),
    };
    return info;
}
