# Chord


## Code Organization

- `base`: Provides general utilities and user interface building blocks
- `music`: music service apis
- `workbench`: framework for "viewlets" like the Explorer, Status Bar, or Menu Bar



## Target Environments

- `common`: Source code that only requires basic JavaScript APIs and run in all the other target environments
- `browser`: Source code that requires the `browser` APIs like access to the DOM
  - may use code from: `common`
- `node`: Source code that requires [`nodejs`](https://nodejs.org/) APIs
  - may use code from: `common`
- `electron-browser`: Source code that requires the [Electron renderer-process](https://github.com/atom/electron/tree/master/docs#modules-for-the-renderer-process-web-page)APIs
  - may use code from: `common`, `browser`, `node`
- `electron-main`: Source code that requires the [Electron main-process](https://github.com/atom/electron/tree/master/docs#modules-for-the-main-process) APIs
  - may use code from: `common`, `node`
