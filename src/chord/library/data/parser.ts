'use strict';

import { jsonLoadValue } from 'chord/base/common/json';

import { ISong } from "chord/music/api/song";
import { IAlbum } from "chord/music/api/album";
import { IArtist } from "chord/music/api/artist";
import { ICollection } from "chord/music/api/collection";
import { IUserProfile } from "chord/music/api/user";
import { IAudio } from "chord/music/api/audio";

import { IEpisode } from 'chord/sound/api/episode';
import { IPodcast } from 'chord/sound/api/podcast';
import { IRadio } from 'chord/sound/api/radio';


export function toNumber(obj: any) {
    if (obj.type == 'song') {
        let disable = obj.disable;
        if (disable === null) {
            obj.disable = 0;
        }
        if (disable === undefined) {
            obj.disable = 0;
        }
        if (typeof disable === 'boolean') {
            obj.disable = obj.disable + 0;
        }
    }

    let like = obj.like;
    if (like === null) {
        obj.like = 0;
    }
    if (like === undefined) {
        obj.like = 0;
    }
    if (typeof obj.like === 'boolean') {
        obj.like = obj.like + 0;
    }
}


export function toBoolean(obj: any) {
    if (obj.type == 'song') {
        let disable = obj.disable;
        if (disable === null) {
            obj.disable = false;
        }
        if (disable === undefined) {
            obj.disable = false;
        }
        if (typeof disable === 'number') {
            obj.disable = !!disable;
        }
    }

    let like = obj.like;
    if (like === null) {
        obj.like = false;
    }
    if (like === undefined) {
        obj.like = false;
    }
    if (typeof obj.like === 'number') {
        obj.like = !!like;
    }
}


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
    toBoolean(song);
    return <ISong>song;
}

export function makeAlbum(info: any): IAlbum {
    let album = { ...info };

    // Get songs use LibraryDatabase.libraryAlbumSongs
    album.songs = [];
    jsonLoadValue(album);
    toBoolean(album);
    return <IAlbum>album;
}

export function makeArtist(info: any): IArtist {
    let artist = { ...info };
    jsonLoadValue(artist);
    artist.songs = [];
    artist.albums = [];
    toBoolean(artist);
    return <IArtist>artist;
}

export function makeCollection(info: any): ICollection {
    let collection = { ...info };
    jsonLoadValue(collection);
    collection.songs = [];
    toBoolean(collection);
    return <ICollection>collection;
}

export function makeUserProfile(info: any): IUserProfile {
    let userProfile: IUserProfile = { ...info };
    jsonLoadValue(userProfile);
    userProfile.songs = [];
    userProfile.albums = [];
    userProfile.favoriteCollections = [];
    userProfile.createdCollections = [];
    userProfile.followers = [];
    userProfile.followings = [];
    toBoolean(userProfile);
    return <IUserProfile>userProfile;
}

export function makeEpisode(info: any): IEpisode {
    let episode = { ...info };
    jsonLoadValue(episode);
    toBoolean(episode);
    return <IEpisode>episode;
}

export function makePodcast(info: any): IPodcast {
    let podcast = { ...info };

    // Get songs use LibraryDatabase.podcastEpisodes
    podcast.episodes = [];
    jsonLoadValue(podcast);
    toBoolean(podcast);
    return <IPodcast>podcast;
}

export function makeRadio(info: any): IRadio {
    let radio = { ...info };

    jsonLoadValue(radio);
    radio.episodes = [];
    radio.podcasts = [];
    radio.favoritePodcasts = [];
    radio.followers = [];
    radio.followings = [];
    toBoolean(radio);
    return <IRadio>radio;

}
