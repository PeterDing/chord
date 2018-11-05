'use strict';

import * as cheerio from 'cheerio';

import { ISong } from "chord/music/api/song";
import { IAlbum } from "chord/music/api/album";
import { IArtist } from "chord/music/api/artist";
import { ITag } from "chord/music/api/tag";
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


const _origin = 'netease';

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
    return {
        format: info['type'],
        size: info['size'],
        kbps: Math.floor(info['br'] / 1000),
        url: info['url'],
        path: null,
    };
}

export function makeSong(info: any, privilege?: any): ISong {
    if (!privilege) {
        privilege = info['privilege'];
    }

    let songOriginalId = info['id'].toString();

    // info['album'] for similarSongs
    let albumInfo = info['al'] || info['album'];
    let artistInfo = (info['ar'] && info['ar'][0]) || (info['artists'] && info['artists'][0]);

    let albumCoverUrl: string = albumInfo['picUrl'];

    let disable = privilege['st'] != 0;

    let song: ISong = {
        songId: _getSongId(songOriginalId),

        type: 'song',
        origin: _origin,

        songOriginalId,

        url: _getSongUrl(songOriginalId),

        songName: info['name'],

        albumId: _getAlbumId(albumInfo['id']),
        albumOriginalId: albumInfo['id'].toString(),
        albumName: albumInfo['name'],
        albumCoverUrl: albumCoverUrl,

        artistId: _getArtistId(artistInfo['id']),
        artistOriginalId: artistInfo['id'].toString(),
        artistName: artistInfo['name'],

        track: info['no'],
        cdSerial: info['cd'] ? parseInt(info['cd']) : 1,

        // millisecond
        duration: info['dt'],

        // millisecond
        releaseDate: info['publishTime'],

        playCountWeb: info['cp'],
        playCount: 0,

        audios: [],

        disable,
    };
    return song;
}

export function makeSongs(info: any): Array<ISong> {
    return (info || []).map(songInfo => makeSong(songInfo));
}

export function makeAlbum(info: any): IAlbum {
    // artist's albums have not `album`
    let albumInfo = info['album'] || info;
    let songsInfo = info['songs'];

    let albumOriginalId: string = albumInfo['id'].toString();

    let albumCoverUrl: string = albumInfo['picUrl'];

    let songs: Array<ISong> = (songsInfo || []).map(song => makeSong(song));

    let album: IAlbum = {
        albumId: _getAlbumId(albumOriginalId),

        type: 'album',
        origin: _origin,
        albumOriginalId: albumOriginalId,
        url: _getAlbumUrl(albumOriginalId),

        albumName: albumInfo['name'],
        albumCoverUrl: albumCoverUrl,

        artistId: _getArtistId(albumInfo['artist']['id']),
        artistOriginalId: albumInfo['artist']['id'].toString(),
        artistName: albumInfo['artist']['name'],

        tags: [],

        description: albumInfo['description'] || null,

        releaseDate: albumInfo['publishTime'],

        company: albumInfo['company'],

        songs: songs,
        songCount: albumInfo['size'],
    };
    return album;
}

export function makeAlbums(info: any): Array<IAlbum> {
    return (info || []).map(albumInfo => makeAlbum(albumInfo));
}

export function makeCollection(info: any, privileges: any = []): ICollection {
    let collectionOriginalId = info['id'].toString();
    let collectionCoverUrl = info['coverImgUrl'];
    let tags: Array<ITag> = (info['tags'] || []).map(tag => ({ name: tag }));
    let songs: Array<ISong> = (info['tracks'] || []).map((songInfo, index) => makeSong(songInfo, privileges[index]));
    let duration = songs.length != 0 ? songs.map(s => s.duration).reduce((x, y) => x + y) : null;

    let collection: ICollection = {
        collectionId: _getCollectionId(collectionOriginalId),

        type: 'collection',
        origin: _origin,
        collectionOriginalId,
        url: _getCollectionUrl(collectionOriginalId),

        collectionName: info['name'],

        collectionCoverUrl,

        userId: _getUserId(info['creator']['userId'].toString()),
        userName: info['creator']['nickname'],

        releaseDate: info['createTime'],

        description: info['description'],

        tags,

        duration,

        songs,
        songCount: info['trackCount'],

        playCount: info['playCount'],
        likeCount: info['subscribedCount'],
    };
    return collection;
}

export function makeCollections(info: any): Array<ICollection> {
    return (info || []).map(collectionInfo => makeCollection(collectionInfo));
}

export function makeArtist(info: any): IArtist {
    let artistInfo = info['artist'] || info;
    let songsInfo = info['hotSongs'] || [];

    let artistOriginalId = artistInfo['id'].toString();
    let artistAvatarUrl = artistInfo['picUrl'];
    // let artistAlias = info['alias'].split('/').filter(a => a.trim() != '').map(a => a.trim());
    let songs = songsInfo.map(songInfo => makeSong(songInfo));

    let artist: IArtist = {
        artistId: _getArtistId(artistOriginalId),
        type: 'artist',
        origin: _origin,
        artistOriginalId: artistOriginalId,
        url: _getArtistUrl(artistOriginalId),

        artistName: artistInfo['name'],
        // artistAlias: artistAlias,

        artistAvatarUrl: artistAvatarUrl,

        description: artistInfo['briefDesc'],

        songs,
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

        userName: info['nickname'],

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
