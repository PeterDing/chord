'use strict';

import * as fs from 'fs';

import { deepCopy } from 'chord/base/common/objects';

import { setDescendentProp } from 'chord/base/common/property';

import { IAppConfiguration, initiateAppConfiguration } from 'chord/preference/api/app';
import { APP_CONFIGURATION_PATH } from 'chord/preference/common/app';


export class AppConfiguration {

    private configuration: IAppConfiguration;

    constructor() {
        let config: IAppConfiguration;
        try {
            let appConfig = JSON.parse(fs.readFileSync(APP_CONFIGURATION_PATH).toString());
            let defaultConfig = initiateAppConfiguration();
            appConfig.origins = { ...defaultConfig.origins, ...appConfig.origins };
            config = { ...defaultConfig, ...appConfig };
        } catch (e) {
            config = initiateAppConfiguration();
        }
        this.configuration = config;
    }

    public getConfig(): IAppConfiguration {
        return deepCopy(this.configuration);
    }

    public setConfig(path: string, value: any): void {
        setDescendentProp(this.configuration, path, deepCopy(value));
    }

    public saveConfig(config?: IAppConfiguration): void {
        config = config || this.getConfig();
        fs.writeFileSync(APP_CONFIGURATION_PATH, JSON.stringify(config, null, 4), { encoding: 'utf-8' });
    }
}


// Global app configuration
export const appConfiguration = new AppConfiguration();
