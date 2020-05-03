![Chord Player](https://i.ibb.co/ypJyckb/Screen-Shot-2019-04-10-at-2-58-56-PM.png)

<h1 align="center">Chord 弦 - 一个现代音乐播放器</h1>

[![Release](https://img.shields.io/github/release/PeterDing/chord.svg)](https://github.com/PeterDing/chord/releases)
[![Build Status](https://travis-ci.org/PeterDing/chord.svg?branch=master)](https://travis-ci.org/PeterDing/chord)
![Download Count](https://img.shields.io/github/downloads/PeterDing/chord/total.svg)
![License](https://img.shields.io/github/license/PeterDing/chord.svg)

弦提供很多 音乐服务商/播客 的服务，也支持本地音乐文件的播放（开发中）。

弦使用 spotify UI 的样式。

**[下载最新版本](https://github.com/PeterDing/chord/releases)**

[界面截屏](docs/screenshots.md)

[English](README_EN.md)


## 注意

为了正常使用 Himalaya，用户需要在系统 hosts 文件中添加下面一条:  

```
47.254.50.181 api.himalaya.com
```

Windows 用户设置 hosts 文件 见： `https://www.cnblogs.com/chenfei0801/p/3422985.html`  
MacOS，Linux 用户编辑 `/etc/hosts`  

中国国内用户如果要收听部分的 Himalaya 的内容，需要设置一个(科学上网)代理。  
chord 默认不使用代理来访问所有的音频链接，如果音频请求出错且音频链接的域名不属于中国，那么 chord 会尝试用代理来链接。  

如果用户没有设置 hosts 和 代理，可能无法搜索到 Himalaya 的内容。

### 设置代理

依次点击下面选项输入代理链接:

```
Preferences >> CONFIGURATION >> Proxy
```


## 特性

- 支持 

  **Xiami 虾米音乐**

  **Netease music 网易云音乐**

  **QQ music 腾讯音乐**

  ~~**千千音乐**~~ (千千音乐服务不稳定，影响用户体验，所以不再支持)

  **Migu 咪咕音乐**

  **Kuwo 酷我音乐**

  **Ximalaya 喜马拉雅FM**

  **Himalaya**

- 支持功能:

  搜索

  播放 (随机播放, 重复播放)  

  展示艺人，专辑，歌单，用户, 有声书 详细界面

- 支持高品质音频文件 (kbps >= 320)  

  **获得网易云音乐的高品质音频文件需要登录，并且登录用户要是vip**  

- 支持音乐服务商的登录

- 添加/移除音乐对象的动作与原站同步

- 保存喜欢的音乐到本地音乐库

- 推荐的歌曲

- 新发行的音乐

- 歌单筛选

- 专辑筛选

- 艺人筛选

- 支持歌词

- 通知

- 无框窗口

- 播放器的基本功能

- 参数设置


## 待做

- 显示更多的关于歌，艺人，专辑，歌单的信息

- 创建自定义歌单

- ~~音乐类型导航~~ (虾米不开放音乐类型api)

- 添加/删除 本地音乐文件

- 下载器

- 多国语言

- 更多的测试


## 开发者

- [Chord structure](docs/chord.md)

- [Build app](docs/build.md)
