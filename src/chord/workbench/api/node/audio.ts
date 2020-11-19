'use strict';

import { Howl, Howler, HowlOptions } from 'howler';
import { ok } from 'chord/base/common/assert';
import { Store } from 'redux';

import { hasChinaDomain } from 'chord/unity/api/blocked';
import { setBrowserGlobalProxy } from 'chord/base/browser/proxy';


type IHookFn = (soundId?: number, store?: Store, url?: string, playItemId?: string) => void;

interface IHook {
    name: string;
    fn: IHookFn;
}

/**
 * Global Audio Controller
 * 
 * Chord has only one global Audio Controller
 * The class handles ALL audio behaves
 */
class Audio {

    private static audio: Howl | null;
    private static store: Store;

    private static onplayFns: Array<IHook> = [];
    private static onpauseFns: Array<IHook> = [];
    private static onendFns: Array<IHook> = [];
    private static onseekFns: Array<IHook> = [];
    private static onloaderrorFns: Array<IHook> = [];

    private static rateVal: number;

    private static onplay(soundId?: number, store?: Store, url?: string, playItemId?: string): void {
        this.onplayFns.forEach(item => {
            item.fn(soundId, store, url, playItemId);
        });
    }

    private static onpause(soundId?: number, store?: Store, url?: string, playItemId?: string): void {
        this.onpauseFns.forEach(item => {
            item.fn(soundId, store, url, playItemId);
        });
    }

    private static onend(soundId?: number, store?: Store, url?: string, playItemId?: string): void {
        this.onendFns.forEach(item => {
            item.fn(soundId, store, url, playItemId);
        });
    }

    private static onseek(soundId?: number, store?: Store, url?: string, playItemId?: string): void {
        this.onseekFns.forEach(item => {
            item.fn(soundId, store, url, playItemId);
        });
    }

    private static onloaderror(soundId?: number, store?: Store, url?: string, playItemId?: string): void {
        this.onloaderrorFns.forEach(item => {
            item.fn(soundId, store, url, playItemId);
        });
    }

    /**
     * Get Global Howl instance
     */
    static getAudio(): Howl | null {
        return Audio.audio;
    }

    static hasAudio(): boolean {
        return !!Audio.audio;
    }

    /**
     * Make a Howl instance
     */
    protected static doMakeAudio(url: string, playItemId?: string): Howl {
        let audioOptions: HowlOptions = {
            src: url,

            // Force to HTML5 so that the audio can stream in (best for large files).
            html5: true,
            autoplay: false,
            rate: Audio.rateVal || 1.0,

            onplay: (soundId: number) => Audio.onplay(soundId, Audio.store, url, playItemId),
            onpause: (soundId: number) => Audio.onpause(soundId, Audio.store, url, playItemId),
            onend: (soundId: number) => Audio.onend(soundId, Audio.store, url, playItemId),
            onseek: (soundId: number) => Audio.onseek(soundId, Audio.store, url, playItemId),
            onloaderror: (soundId: number) => Audio.onloaderror(soundId, Audio.store, url, playItemId),
        };
        return new Howl(audioOptions);
    }

    /**
     * Make(or change) the Global Howl instance
     */
    static makeAudio(url: string, playItemId?: string) {
        if (Audio.audio) {
            Audio.stop();
            Audio.destroy();
        }

        // Cancel global proxy for China webs
        if (hasChinaDomain(url)) {
            setBrowserGlobalProxy(null);
        }

        Audio.audio = Audio.doMakeAudio(url, playItemId);
    }

    static seek(position?: number): number {
        ok(Audio.audio, '[Audio.seek] no audio instance');
        if (position) {
            Audio.audio.seek(position);
            return position;
        } else {
            return <number>Audio.audio.seek(position);
        }
    }

    // Get/set the global volume for all sounds, relative to their own volume.
    static volume(value?: number): number {
        Howler.volume(value);
        return Howler.volume();
    }

    static play() {
        ok(Audio.audio, '[Audio.play] no audio instance');
        Audio.audio.play();
    }

    static stop() {
        ok(Audio.audio, '[Audio.stop] no audio instance');
        Audio.audio.stop();
    }

    static pause() {
        ok(Audio.audio, '[Audio.pause] no audio instance');
        Audio.audio.pause();
    }

    // Set and change rate
    static rate(r: number) {
        Audio.rateVal = r;
        if (Audio.audio) {
            Audio.audio.rate(r);
        }
    }

    static playing(): boolean {
        return !!Audio.audio && Audio.audio.playing();
    }

    /**
     * return unloaded, loading or loaded
     */
    static state(): string {
        ok(Audio.audio, '[Audio.state] no audio instance');
        return Audio.audio.state();
    }

    static duration(): number {
        return Audio.audio ? Audio.audio.duration() : 0;
    }

    static destroy() {
        if (Audio.audio) {
            // Unload and destroy a Howl object.
            // This will immediately stop all sounds attached to this sound
            // and remove it from the cache.
            Audio.audio.unload();
            delete Audio.audio;
            Audio.audio = null;
        }
    }

    /**
     * register the global redux store
     */
    static registerStore(store: Store) {
        Audio.store = store;
    }

    static registerOnPlay(name: string, onplay: IHookFn) {
        Audio.onplayFns = Audio.onplayFns.filter(hook => hook.name != name);
        Audio.onplayFns.push({ name, fn: onplay });
    }

    static registerOnPause(name: string, onpause: IHookFn) {
        Audio.onpauseFns = Audio.onpauseFns.filter(hook => hook.name != name);
        Audio.onpauseFns.push({ name, fn: onpause });
    }

    static registerOnEnd(name: string, onend: IHookFn) {
        Audio.onendFns = Audio.onendFns.filter(hook => hook.name != name);
        Audio.onendFns.push({ name, fn: onend });
    }

    static registerOnSeek(name: string, onseek: IHookFn) {
        Audio.onseekFns = Audio.onseekFns.filter(hook => hook.name != name);
        Audio.onseekFns.push({ name, fn: onseek });
    }

    static registerOnLoadError(name: string, onloaderror: IHookFn) {
        Audio.onloaderrorFns = Audio.onloaderrorFns.filter(hook => hook.name != name);
        Audio.onloaderrorFns.push({ name, fn: onloaderror });
    }
}


export { Audio as CAudio };
