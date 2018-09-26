'use strict';

import * as assert from 'assert';
import { suite, test } from 'mocha';

import { aliMusicApi as aliApi } from 'chord/music/xiami/api';


suite('music/xiami/AliMusicApi', () => {

    test('song', async function() {
        let song = await aliApi.song('1');

        let songId = song.songId;
        assert.equal(songId, 'xm|s|1');

        let songOriginalId = song.songOriginalId;
        assert.equal(songOriginalId, '1');

        let albumId = song.albumId;
        assert.equal(albumId, 'xm|a|1');
    });

    test('songs', async function() {
        let songs = await aliApi.songs(['1', '2']);

        let size = songs.length;
        assert.equal(size, 2);

        let songId = songs[0].songId;
        assert.equal(songId, 'xm|s|1');

        let albumId = songs[1].albumId;
        assert.equal(albumId, 'xm|a|1');
    });

    test('similarSongs', async function() {
        let songs = await aliApi.similarSongs('1');

        let size = songs.length;
        assert.equal(size > 0, true);
    });

    test('album', async function() {
        let album = await aliApi.album('1');

        let albumId = album.albumId;
        assert.equal(albumId, 'xm|a|1');

        let songsSize = album.songs.length;
        assert.equal(songsSize, 11);

        let audios = album.songs[0].audios;
        assert.equal(audios.length > 0, true);
    });

    test('albums', async function() {
        let albums = await aliApi.albums(['1', '2']);

        let size = albums.length;
        assert.equal(size, 2);

        let albumId = albums[0].albumId;
        assert.equal(albumId, 'xm|a|1');
    });

    test('artist', async function() {
        let artist = await aliApi.album('1');

        let artistId = artist.artistId;
        assert.equal(artistId, 'xm|t|1');

        let name = artist.artistName;
        assert.equal(name, 'Alex');
    });

    test('artistSongs', async function() {
        let songs = await aliApi.artistSongs('1');

        let size = songs.length;
        assert.equal(size, 10);

        let name = songs[0].artistName;
        assert.equal(name, 'Alex');
    });

    test('artistSongCount', async function() {
        let size = await aliApi.artistSongCount('1');

        assert.equal(size > 0, true);
    });

    test('artistAlbums', async function() {
        let albums = await aliApi.artistAlbums('1');

        let size = albums.length;
        assert.equal(size, 3);

        let name = albums[0].artistName;
        assert.equal(name, 'Alex');
    });

    test('artistAlbumCount', async function() {
        let size = await aliApi.artistAlbumCount('1');

        assert.equal(size > 0, true);
    });

    test('similarArtists', async function() {
        let artists = await aliApi.similarArtists('1');

        let size = artists.length;
        assert.equal(size > 0, true);
    });

    test('similarArtistCount', async function() {
        let size = await aliApi.similarArtistCount('1');

        assert.equal(size > 0, true);
    });

    test('collection', async function() {
        let collection = await aliApi.collection('398783788');

        let songsSize = collection.songs.length;
        assert.equal(songsSize > 0, true);

        let collectionId = collection.collectionId;
        assert.equal(collectionId, 'xm|c|398783788');
    });


    test('collections', async function() {
        let collections = await aliApi.collections('BGM');

        let size = collections.length;
        assert.equal(size, 10);
    });

    test('searchSongs', async function() {
        let songs = await aliApi.searchSongs('linkin', 2, 10);

        let size = songs.length;
        assert.equal(size, 10);
    });

    test('searchAlbums', async function() {
        let albums = await aliApi.searchAlbums('linkin');

        let size = albums.length;
        assert.equal(size, 10);
    });

    test('searchArtists', async function() {
        let artists = await aliApi.searchArtists('linkin');

        let size = artists.length;
        assert.equal(size, 10);
    });

    test('searchCollections', async function() {
        let collections = await aliApi.searchCollections('linkin');

        let size = collections.length;
        assert.equal(size, 10);
    });
});
