'use strict';

import { jsonLoadValue } from 'chord/base/common/json';

import { ISong } from "chord/music/api/song";
import { IAlbum } from "chord/music/api/album";
import { IArtist } from "chord/music/api/artist";
import { ICollection } from "chord/music/api/collection";
import { IAudio } from "chord/music/api/audio";


export function makeAudio(info: any): IAudio {
    let audio = { ...info };
    delete audio.songId;

    // audio url must be token freshly
    audio.url = null;
    return <IAudio>audio;
}

export function makeSong(info: any): ISong {
    let song = { ...info };
    jsonLoadValue(song);
    return <ISong>song;
}

export function makeAlbum(info: any): IAlbum {
    let album = { ...info };

    // Get songs use UserDatabase.userAlbumSongs
    album.songs = [];
    jsonLoadValue(album);
    return <IAlbum>album;
}

export function makeArtist(info: any): IArtist {
    let artist = { ...info };
    jsonLoadValue(artist);
    artist.songs = [];
    artist.albums = [];
    return <IArtist>artist;
}

export function makeCollection(info: any): ICollection {
    let collection = { ...info };
    jsonLoadValue(collection);
    collection.songs = [];
    return <ICollection>collection;
}
