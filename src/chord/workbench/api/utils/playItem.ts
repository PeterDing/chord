'use strict';

import { TPlayItem, isOriginAlive } from 'chord/unity/api/items';
import { ORIGIN } from 'chord/music/common/origin';
import { ISong } from 'chord/music/api/song';
import { IEpisode } from 'chord/sound/api/episode';
import { IAudio } from 'chord/music/api/audio';

import { ESize } from 'chord/music/common/size';

import { AlbumIcon, PodcastIcon } from 'chord/workbench/parts/common/component/common';

import { musicApi } from 'chord/music/core/api';
import { soundApi } from 'chord/sound/core/api';

import { appConfiguration } from 'chord/preference/configuration/app';


export function hasPlayItemAudioPath(playItem: TPlayItem): boolean {
    let has = false;
    for (let audio of playItem.audios) {
        has = !!(audio.path);
        if (has) {
            return has;
        }
    }
    return has;
}

export function hasPlayItemAudio(playItem: TPlayItem): boolean {
    let has = false;
    for (let audio of playItem.audios) {
        has = !!(audio.url || audio.path);
        if (has) {
            return has;
        }
    }
    return has;
}

export function filterPlayItemWithAudios(playItems: Array<TPlayItem>): Array<TPlayItem> {
    return playItems.filter(playItem => hasPlayItemAudio(playItem));
}

export async function addPlayItemAudios(playItem: TPlayItem, supKbps?: number) {
    if (!isOriginAlive(playItem.origin as ORIGIN)) {
        return;
    }

    supKbps = supKbps || appConfiguration.getConfig().maxKbps;

    // netease, qianqian, qq and ximalaya's audio url needs to be got by realtime
    if (!hasPlayItemAudio(playItem)) {
        switch (playItem.type) {
            case 'song':
                playItem.audios = await musicApi.audios((playItem as ISong).songId, supKbps);
                break;
            case 'episode':
                playItem.audios = await soundApi.audios((playItem as IEpisode).episodeId, supKbps);
                break;
            default:
                break;
        }
    }
}

export async function addPlayItemAudiosIter(playItems: Array<TPlayItem>): Promise<Array<TPlayItem>> {
    for (let index = 0; index < playItems.length; index += 1) {
        let playItem = playItems[index];
        await addPlayItemAudios(playItem);
        if (hasPlayItemAudio(playItem)) {
            return playItems.slice(index);
        }
    }
    return [];
}


/**
 * Select the audio file which is less than or equal to the given supper kbps from a list
 *
 * maximum of kbps
 * https://en.wikipedia.org/wiki/Bit_rate
 */
export function selectAudio(audios: Array<IAudio>, supKbps?: number): IAudio {
    supKbps = supKbps || appConfiguration.getConfig().maxKbps;

    if (audios.length == 0) return null;

    let audio = audios.filter(audio =>
        (audio.url || audio.path)
        && (audio.format != 'ape')  // howler does not support `ape` audio format
        && ((audio.kbps || 96) <= supKbps)
    ).sort((x, y) => y.kbps - x.kbps)[0];

    // TODO, notice no available kbps

    if (!audio) audio = audios[0];
    return audio;
}


export class PlayItem {

    private inner: TPlayItem;

    constructor(item: TPlayItem) {
        this.inner = item;

        this.take = this.take.bind(this);
        this.id = this.id.bind(this);
        this.type = this.type.bind(this);
        this.cover = this.cover.bind(this);
        this.icon = this.icon.bind(this);
    }

    take(): TPlayItem {
        return this.inner;
    }

    id(): string {
        return (this.inner as any).songId || (this.inner as any).episodeId;
    }

    type(): string {
        return this.inner.type;
    }

    cover(size: ESize): string {
        let item = this.inner;
        switch (this.type()) {
            case 'song':
                let item1 = item as ISong;
                return item1.albumCoverPath || musicApi.resizeImageUrl(item1.origin, item1.albumCoverUrl, size);
            case 'episode':
                let item2 = item as IEpisode;
                return item2.podcastCoverPath || soundApi.resizeImageUrl(item2.origin, item2.podcastCoverUrl, size);
            default:
                throw new Error(`[ERROR] [PlayItem.cover] Here will never be occured. [inner]: ${item}`);
        }
    }

    icon() {
        switch (this.type()) {
            case 'song':
                return AlbumIcon;
            case 'episode':
                return PodcastIcon;
            default:
                throw new Error(`[ERROR] [PlayItem.icon] Here will never be occured. [inner]: ${this.type()}`);
        }
    }

    name(): string {
        let item = this.inner;
        switch (this.type()) {
            case 'song':
                return (item as ISong).songName;
            case 'episode':
                return (item as IEpisode).episodeName;
            default:
                throw new Error(`[ERROR] [PlayItem.name] Here will never be occured. [inner]: ${this.type()}`);
        }
    }

    boxId(): string {
        let item = this.inner;
        switch (this.type()) {
            case 'song':
                return (item as ISong).albumId;
            case 'episode':
                return (item as IEpisode).podcastId;
            default:
                throw new Error(`[ERROR] [PlayItem.boxId] Here will never be occured. [inner]: ${this.type()}`);
        }
    }

    boxName(): string {
        let item = this.inner;
        switch (this.type()) {
            case 'song':
                return (item as ISong).albumName;
            case 'episode':
                return (item as IEpisode).podcastName;
            default:
                throw new Error(`[ERROR] [PlayItem.boxName] Here will never be occured. [inner]: ${this.type()}`);
        }
    }

    ownerId(): string {
        let item = this.inner;
        switch (this.type()) {
            case 'song':
                return (item as ISong).artistId;
            case 'episode':
                return (item as IEpisode).radioId;
            default:
                throw new Error(`[ERROR] [PlayItem.boxName] Here will never be occured. [inner]: ${this.type()}`);
        }
    }

    ownerName(): string {
        let item = this.inner;
        switch (this.type()) {
            case 'song':
                return (item as ISong).artistName;
            case 'episode':
                return (item as IEpisode).radioName;
            default:
                throw new Error(`[ERROR] [PlayItem.boxName] Here will never be occured. [inner]: ${this.type()}`);
        }
    }
}
