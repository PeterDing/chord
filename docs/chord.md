# Chord Structure


## Code Organization

- `base`: Provides general utilities and user interface building blocks
- `code`: `electron` app main code
- `library`: Local library apis
- `preference`: chord configuration and user configuration
- `music`: Music providers' service apis
- `workbench`: framework for all electron browser "views" like the main view, player, Menus


## Target Environments

- `common`: Source code that only requires basic JavaScript APIs and run in all the other target environments
  - !!! `chord/workbench/parts/common` is common "views" for chord
- `browser`: Source code that requires the `browser` APIs like access to the DOM
  - may use code from: `common`
- `node`: Source code that requires [`nodejs`](https://nodejs.org/) APIs
  - may use code from: `common`
- `electron-browser`: Source code that requires the [Electron renderer-process](https://github.com/atom/electron/tree/master/docs#modules-for-the-renderer-process-web-page)APIs
  - may use code from: `common`, `browser`, `node`
- `electron-main`: Source code that requires the [Electron main-process](https://github.com/atom/electron/tree/master/docs#modules-for-the-main-process) APIs
  - may use code from: `common`, `node`


## Loader

We use [Microsoft/vscode-loader](https://github.com/Microsoft/vscode-loader) to load compiled AMD code.
