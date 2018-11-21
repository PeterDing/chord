'use strict';

import * as fs from 'fs';

import { deepCopy } from 'chord/base/common/objects';

import { setDescendentProp } from 'chord/base/common/property';

import { IUserConfiguration, initiateUserConfiguration } from 'chord/preference/api/user';
import { USER_CONFIGURATION_PATH } from 'chord/preference/common/user';


export class UserConfiguration {

    private configuration: IUserConfiguration;

    constructor() {
        let config: IUserConfiguration;
        try {
            config = JSON.parse(fs.readFileSync(USER_CONFIGURATION_PATH).toString());
            config = { ...initiateUserConfiguration(), ...config };
        } catch (e) {
            config = initiateUserConfiguration();
        }
        this.configuration = config;
    }

    public getConfig(): IUserConfiguration {
        return deepCopy(this.configuration);
    }

    public setConfig(path: string, value: any): void {
        setDescendentProp(this.configuration, path, deepCopy(value));
    }

    public saveConfig(config?: IUserConfiguration): void {
        config = config || this.configuration;
        fs.writeFileSync(USER_CONFIGURATION_PATH, JSON.stringify(config, null, 4), { encoding: 'utf-8' });
    }
}


// Global user configuration
export const userConfiguration = new UserConfiguration();
