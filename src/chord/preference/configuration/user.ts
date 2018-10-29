'use strict';

import * as fs from 'fs';

import { IUserConfiguration, initiateUserConfiguration } from 'chord/preference/api/user';
import { USER_CONFIGURATION_PATH } from 'chord/preference/common/user';


export class UserConfiguration {

    static configuration: IUserConfiguration;

    public getConfig(): IUserConfiguration {
        if (UserConfiguration.configuration) {
            return UserConfiguration.configuration;
        }

        let config: IUserConfiguration;
        try {
            config = JSON.parse(fs.readFileSync(USER_CONFIGURATION_PATH).toString());
            config = { ...initiateUserConfiguration(), ...config };
        } catch (e) {
            config = initiateUserConfiguration();
        }

        UserConfiguration.configuration = config;
        return config;
    }

    public setConfig(key: string, value: any): void {
        let config = this.getConfig();
        config[key] = value;
    }

    public saveConfig(config?: IUserConfiguration): void {
        config = config || this.getConfig();
        fs.writeFileSync(USER_CONFIGURATION_PATH, JSON.stringify(config), { encoding: 'utf-8' });
    }
}


// Global user configuration
export const userConfiguration = new UserConfiguration();
