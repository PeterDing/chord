'use strict';

import { Howl, Howler } from 'howler';
import { ok } from 'chord/base/common/assert';
import { Store } from 'redux';


type IHookFn = (soundId?: number, store?: Store) => void;

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

    private static onplay(soundId?: number, store?: Store): void {
        this.onplayFns.forEach(item => {
            item.fn(soundId, store);
        });
    }

    private static onpause(soundId?: number, store?: Store): void {
        this.onpauseFns.forEach(item => {
            item.fn(soundId, store);
        });
    }

    private static onend(soundId?: number, store?: Store): void {
        this.onendFns.forEach(item => {
            item.fn(soundId, store);
        });
    }

    private static onseek(soundId?: number, store?: Store): void {
        this.onseekFns.forEach(item => {
            item.fn(soundId, store);
        });
    }

    private static onloaderror(soundId?: number, store?: Store): void {
        this.onloaderrorFns.forEach(item => {
            item.fn(soundId, store);
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
    protected static doMakeAudio(url: string): Howl {
        let audioOptions = {
            src: url,

            // Force to HTML5 so that the audio can stream in (best for large files).
            html5: true,
            autoplay: false,

            onplay: (soundId: number) => Audio.onplay(soundId, Audio.store),
            onpause: (soundId: number) => Audio.onpause(soundId, Audio.store),
            onend: (soundId: number) => Audio.onend(soundId, Audio.store),
            onseek: (soundId: number) => Audio.onseek(soundId, Audio.store),
            onloaderror: (soundId: number) => Audio.onloaderror(soundId, Audio.store),
        };
        return new Howl(audioOptions);
    }

    /**
     * Make(or change) the Global Howl instance
     */
    static makeAudio(url: string) {
        if (Audio.audio) {
            Audio.stop();
            Audio.destroy();
        }
        Audio.audio = Audio.doMakeAudio(url);
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
