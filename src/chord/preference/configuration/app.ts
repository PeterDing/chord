'use strict';

import * as fs from 'fs';

import { APP_CONFIGURATION_PATH } from 'chord/preference/common/app';
import { IAppConfiguration, initiateAppConfiguration } from 'chord/preference/api/app';


export class AppConfiguration {

    static configuration: IAppConfiguration;


    public getConfig(): IAppConfiguration {
        if (AppConfiguration.configuration) {
            return AppConfiguration.configuration;
        }

        let config;
        try {
            config = JSON.parse(fs.readFileSync(APP_CONFIGURATION_PATH).toString());
            config = { ...config, ...initiateAppConfiguration() };
        } catch (e) {
            config = initiateAppConfiguration();
        }

        AppConfiguration.configuration = config;
        return config;
    }

    public setConfig(key: string, value: string): void {
        let config = this.getConfig();
        config[key] = value;
    }

    public saveConfig(config?: IAppConfiguration): void {
        config = config || this.getConfig();
        fs.writeFileSync(APP_CONFIGURATION_PATH, JSON.stringify(config), { encoding: 'utf-8' });
    }
}
