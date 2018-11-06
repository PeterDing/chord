'use strict';

import { Howl, Howler } from 'howler';
import { ok } from 'chord/base/common/assert';
import { Store } from 'redux';


/**
 * Global Audio Controller
 * 
 * Chord has only one global Audio Controller
 * The class handles ALL audio behaves
 */
class Audio {

    private static audio: Howl | null;
    private static store: Store;

    private static onplay: (soundId: number, store: Store) => void;
    private static onpause: (soundId: number, store: Store) => void;
    private static onend: (soundId: number, store: Store) => void;

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

    static seek(position?: number) {
        ok(Audio.audio, '[Audio.seek] no audio instance');
        return Audio.audio.seek(position);
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

    static registerOnPlay(onplay: (soundId: number, store: Store) => void) {
        Audio.onplay = onplay;
    }

    static registerOnPause(onpause: (soundId: number, store: Store) => void) {
        Audio.onpause = onpause;
    }

    static registerOnEnd(onend: (soundId: number, store: Store) => void) {
        Audio.onend = onend;
    }
}


export { Audio as CAudio };
