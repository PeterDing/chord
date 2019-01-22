# App Building

## For macos

You must have `git`, `node 10.x`, `xcode` and `npm` or `yarn`

### Building process

1. Clone `https://github.com/PeterDing/chord`

```shell
git clone https://github.com/PeterDing/chord chord
```

2. Install dependences, I use `yarn` here

```shell
cd chord
yarn install
```

3. Compile typescript files

```shell
yarn run compile
```

4. Build dmg

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

2. Install dependences, I use `yarn` here

```shell
cd chord
yarn install
```

3. Compile typescript files

```shell
yarn run compile
```

4. Clean breaking linking

```shell
cd build
python clean-windows-fail-links.py
cd ..
```

5. Build exe

```shell
yarn run dist:win
```

## Build on linux (ubuntu)

You must have `git`, `node 10.x` and `npm` or `yarn`

`build-essential` is also needed

0. Install tools

```shell
sudo apt update
sudo apt install -y build-essential gcc g++ make bsdtar

# Install nodejs
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get update && sudo apt-get install -y nodejs

# Install yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install -y yarn

sudo apt install -y python-dev
```

1. Clone `https://github.com/PeterDing/chord`

```shell
git clone https://github.com/PeterDing/chord chord
```

2. Install dependences, I use `yarn` here

```shell
cd chord
yarn install
```

3. Compile typescript files

```shell
yarn run compile
```

4. Build dmg

```shell
yarn run dist:linux
```
