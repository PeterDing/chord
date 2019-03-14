# Chord 弦 - A Modern Music Player

[![Build Status](https://travis-ci.org/PeterDing/chord.svg?branch=master)](https://travis-ci.org/PeterDing/chord)

Chord supports many remote music providers' services and local music files service (developping).

Chord uses the framework of spotify UI.

[Download the last version](https://github.com/PeterDing/chord/releases)

[screenshots](docs/screenshots.md)

[中文](README_ZH.md)

## Features

* Support Xiami 虾米, Netease music 网易云音乐, QQ music 腾讯音乐
* Support functions:  
  Search  
  Play (shuffle, repeat)  
  Show Artist, album, collection, user profile at detail
* High quality audio file (kbps >= 320)  
  **Login is needed to get high quality audio files for Netease music**  
  **and the logined user must be a vip user**
* Login to music providers
* Saving/removing and playing actions synchronize to matched music provider
* Store your favoriate music to local library
* Recommanded music (After user logined, recommanded music is based on the user)
* New released music
* Select collections by options
* Toggle lyric
* Common functions for player

## Todos

- App configuration
- Selectable quality of audio file
- Create customized playlist
- ~~Music style/genre navigation~~ (xiami does not open apis for genres)
- Add/Remove local music files
- Downloader
- i18n
- More test

## For Developer

- [Chord structure](docs/chord.md)
- [Build app](docs/build.md)
