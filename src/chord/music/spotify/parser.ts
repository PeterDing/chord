'use strict';

import * as cheerio from 'cheerio';

import { ISong } from "chord/music/api/song";
import { ILyric } from 'chord/music/api/lyric';
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

import { makeLyric as _makeLyric } from 'chord/music/utils/lyric';
import { parseToMillisecond } from 'chord/base/common/time';


const _origin = 'spotify';

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


export function makeSong(info: any): ISong {
    let songOriginalId = info['id'];

    // info['album'] for similarSongs
    let albumInfo = info['album'] || info;
    let artistInfo = info['artists'] && info['artists'][0];

    // albumCoverUrl is json
    // like:
    // [
    //   {
    //     height: 640,
    //     url: "https://i.scdn.co/image/ab6761610000e5eb34e5aa6afc1ba147bfbb0677",
    //     width: 640,
    //   },
    //   {
    //     height: 320,
    //     url: "https://i.scdn.co/image/ab6761610000517434e5aa6afc1ba147bfbb0677",
    //     width: 320,
    //   },
    //   {
    //     height: 160,
    //     url: "https://i.scdn.co/image/ab6761610000f17834e5aa6afc1ba147bfbb0677",
    //     width: 160,
    //   },
    // ];
    let albumCoverUrl = albumInfo['images'] || [];

    let song: ISong = {
        songId: _getSongId(songOriginalId),

        type: 'song',
        origin: _origin,

        songOriginalId,

        url: _getSongUrl(songOriginalId),

        songName: info['name'],

        albumId: _getAlbumId(albumInfo['id']),
        albumOriginalId: albumInfo['id'],
        albumName: albumInfo['name'],
        albumCoverUrl: albumCoverUrl,

        artistId: _getArtistId(artistInfo['id']),
        artistOriginalId: artistInfo['id'],
        artistName: artistInfo['name'],

        track: info['track_number'],
        cdSerial: info['disc_number'],

        // millisecond
        duration: info['duration_ms'],

        // millisecond
        releaseDate: Date.parse(albumInfo['release_date']),

        audios: [],
    };
    return song;
}

export function makeSongs(info: any): Array<ISong> {
    return (info || []).map(songInfo => makeSong(songInfo));
}

export function makeAlbum(info: any): IAlbum {
    // artist's albums have not `album`
    let albumOriginalId: string = info['id'];

    let albumCoverUrl = info['images'] || [];
    let releaseDate = Date.parse(info['release_date']);

    let songs: Array<ISong> = ((info['tracks'] && info['tracks']['items']) || []).map(songInfo => {
        let song = makeSong(songInfo);
        // song info does not provide its album cover url
        song.albumCoverUrl = albumCoverUrl;
        song.releaseDate = releaseDate;
        return song;
    });

    let album: IAlbum = {
        albumId: _getAlbumId(albumOriginalId),

        type: 'album',
        origin: _origin,
        albumOriginalId: albumOriginalId,
        url: _getAlbumUrl(albumOriginalId),

        albumName: info['name'],
        albumCoverUrl: albumCoverUrl,

        artistId: _getArtistId(info['artists'][0]['id']),
        artistOriginalId: info['artists'][0]['id'],
        artistName: info['artists'][0]['name'],

        tags: info['label'] ? [{ name: info['label'] }] : [],
        genres: (info['genres'] || []).map(name => { name }),

        releaseDate,

        songs: songs,
        songCount: info['tracks'] && info['tracks']['total'],

        likeCount: info['popularity'],
    };
    return album;
}

export function makeAlbums(info: any): Array<IAlbum> {
    return (info || []).map(albumInfo => makeAlbum(albumInfo));
}

export function makeArtist(info: any): IArtist {
    let artistOriginalId = info['id'];
    let artistAvatarUrl = info['images'] || [];

    let artist: IArtist = {
        artistId: _getArtistId(artistOriginalId),
        type: 'artist',
        origin: _origin,
        artistOriginalId: artistOriginalId,
        url: _getArtistUrl(artistOriginalId),

        artistName: info['name'],

        artistAvatarUrl: artistAvatarUrl,

        songs: [],
        albums: [],

        genres: (info['genres'] || []).map(name => { name }),

        likeCount: info['followers'] && info['followers']['total'],
    };
    return artist;
}

export function makeArtists(info: any): Array<IArtist> {
    return (info || []).map(artistInfo => makeArtist(artistInfo));
}

export function makeCollection(info: any): ICollection {
    let collectionOriginalId = info['id'];
    let collectionCoverUrl = info['images'] || [];
    let songs: Array<ISong> = (info['tracks'] && info['tracks']['items'] || []).map(
        songInfo => makeSong(songInfo['track'])
    );
    let duration = songs.length != 0 ? songs.map(s => s.duration).reduce((x, y) => x + y) : null;

    let userInfo = info['owner'] || info;
    let userOriginalId = userInfo['id'];
    let userName = info['display_name'];

    let collection: ICollection = {
        collectionId: _getCollectionId(collectionOriginalId),

        type: 'collection',
        origin: _origin,
        collectionOriginalId,
        url: _getCollectionUrl(collectionOriginalId),

        collectionName: info['name'],

        collectionCoverUrl,

        userId: _getUserId(userOriginalId),
        userName,

        description: info['description'],

        duration,

        songs,
        songCount: info['tracks'] && info['tracks']['total'],
    };
    return collection;
}

export function makeCollections(info: any): Array<ICollection> {
    return (info || []).map(collectionInfo => makeCollection(collectionInfo));
}
