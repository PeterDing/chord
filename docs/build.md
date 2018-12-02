# App Building

## For macos

You must have `git`, `node 10.x`, `xcode` and `npm` or `yarn`

### Building process

1. Clone `https://github.com/PeterDing/chord`

```shell
git clone https://github.com/PeterDing/chord chord
```

2. Installing dependences, I use `yarn` here

```shell
cd chord
yarn install
```

3. Compiling typescript files

```shell
yarn run compile
```

4. Building dmg

```shell
yarn run dist:mac
```

## Build on Windows

You must have `git`, `node 10.x` and `npm` or `yarn`, `python2.7.x`

The [v140 Platform Toolset](https://developercommunity.visualstudio.com/content/problem/48806/cant-find-v140-in-visual-studio-2017.html)
is needed.

### Building process

1. Clone `https://github.com/PeterDing/chord`

```shell
git clone https://github.com/PeterDing/chord chord
```

2. Installing dependences, I use `yarn` here

```shell
cd chord
yarn install
```

3. Compiling typescript files

```shell
yarn run compile
```

4. Clean breaking linking

```shell
cd build
python clean-windows-fail-links.py
cd ..
```

5. Building exe

```shell
yarn run dist:win
```

## Build on linux (ubuntu)

You must have `git`, `node 10.x` and `npm` or `yarn`

`build-essential` is also needed


1. Clone `https://github.com/PeterDing/chord`

```shell
git clone https://github.com/PeterDing/chord chord
```

2. Installing dependences, I use `yarn` here

```shell
cd chord
yarn install
```

3. Compiling typescript files

```shell
yarn run compile
```

4. Building dmg

```shell
yarn run dist:linux
```
