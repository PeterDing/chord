'use strict';

import * as debug from 'debug';
import { isWindows } from 'chord/base/common/platform';


export enum LogLevel {
    Trace,
    Debug,
    Info,
    Warning,
    Error,
    Critical,
    Off,
}


export interface ILog {
    getLevel(): LogLevel;
    setLevel(level: LogLevel): void;
    setFormat(format: string): void;

    trace(massage: string, ...args: any[]): void;
    debug(massage: string, ...args: any[]): void;
    info(massage: string, ...args: any[]): void;
    warning(massage: string, ...args: any[]): void;
    error(massage: string, ...args: any[]): void;
    critical(massage: string, ...args: any[]): void;
    off(massage: string, ...args: any[]): void;
}


const DEFAULT_LOG_LEVEL = LogLevel.Info;

// time : level : massage : args
const DEFAULT_LOG_FORMAT = isWindows ? '%s | %s | %s | %O' : '%s 🔅 %s 🔅 %s 🔅 %O';


export class Logger implements ILog {

    private level: LogLevel;
    private _debug: debug.IDebugger;
    private nodeName: string;
    private format: string;

    constructor(nodeName: string, level: LogLevel = DEFAULT_LOG_LEVEL, format: string = DEFAULT_LOG_FORMAT) {
        this.level = level;
        this._debug = debug(nodeName);
        this.nodeName = nodeName;
        this.format = format
    }

    getLevel(): LogLevel {
        return this.level;
    }

    setLevel(level: LogLevel) {
        this.level = level;
    }

    setFormat(format: string) {
        this.format = format;
    }

    private log(level: LogLevel, massage: string | Error, args: any[]): void {
        if (this.getLevel() <= level) {
            debug.enable(this.nodeName);
            this._debug(this.format, new Date().toUTCString(), LogLevel[level], massage, args);
            debug.disable();
        }
    }

    trace(massage: string, ...args: any[]): void {
        this.log(LogLevel.Trace, massage, args);
    }

    debug(massage: string, ...args: any[]): void {
        this.log(LogLevel.Debug, massage, args);
    }

    info(massage: string, ...args: any[]): void {
        this.log(LogLevel.Info, massage, args);
    }

    warning(massage: string | Error, ...args: any[]): void {
        this.log(LogLevel.Warning, massage, args);
    }

    error(massage: string, ...args: any[]): void {
        this.log(LogLevel.Error, massage, args);
    }

    critical(massage: string, ...args: any[]): void {
        this.log(LogLevel.Critical, massage, args);
    }

    off(massage: string, ...args: any[]): void { }
}
