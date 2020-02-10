'use strict';

import * as React from 'react';

import { MiddleButton } from 'chord/workbench/parts/common/component/buttons';
import Select from 'chord/workbench/parts/common/component/select';

import { appConfiguration } from 'chord/preference/configuration/app';


function Title(props: { name: string }) {
    return <h1 className="search-result-title" style={{ textAlign: 'center' }}>{props.name}</h1>;
}


interface IConfigurationViewState {
    view: string;

    proxy: string;
}

export default class ConfigurationView extends React.Component<any, IConfigurationViewState> {

    constructor(props: any) {
        super(props);

        let config = appConfiguration.getConfig();

        this.state = {
            view: 'accounts',
            proxy: config.proxy || '',
        };


        this.saveConfig = this.saveConfig.bind(this);

        this.proxyView = this.proxyView.bind(this);
        this.setProxy = this.setProxy.bind(this);

        this.maxKbpsView = this.maxKbpsView.bind(this);
        this.setMaxKbps = this.setMaxKbps.bind(this);
    }

    saveConfig() {
        appConfiguration.saveConfig();
    }

    inputOnChange(event, key: string) {
        this.setState({
            [key]: event.target.value,
        });
    }

    setProxy() {
        let proxy = this.state.proxy;
        appConfiguration.setConfig('proxy', proxy);
        this.saveConfig();
    }

    proxyView() {
        let config = appConfiguration.getConfig();

        let placeholder = config.proxy || 'socks5://127.0.0.1:10000';

        return (
            <div className='row'>
                <Title name='Proxy' />
                <div className='description'>
                    为了正常使用使用 Himalaya，用户需要在系统 hosts 文件中添加下面一条:
                    <br />
                    <code>
                        47.254.50.181 api.himalaya.com
                    </code>
                    <br />
                    <br />
                    Windows 用户设置 hosts 文件 见： https://www.cnblogs.com/chenfei0801/p/3422985.html
                    <br />
                    MacOS，Linux 用户编辑 <code>/etc/hosts</code>

                    <br />
                    <br />
                    中国国内的用户如果要收听部分的 Himalaya 的内容，需要设置一个(科学上网)代理。
                    <br />
                    chord 默认不使用代理来访问所以的音频链接，如果音频请求出错且音频链接的域名
                    不属于中国，那么 chord 尝试用代理来链接。
                    <br />
                    如果用户没有设置 hosts 和 代理，可能无法搜索到 Himalaya 的内容。
                </div>

                <form onSubmit={(e) => e.preventDefault()}
                    style={{ display: 'flex' }}>
                    <input className="inputBox-input small" type="text"
                        placeholder={placeholder}
                        value={this.state.proxy}
                        onChange={(e) => this.inputOnChange(e, 'proxy')} />
                    <MiddleButton title='Set' click={() => this.setProxy()} />
                </form>
            </div>
        );
    }

    setMaxKbps(event) {
        let kbps = event.target.value;
        appConfiguration.setConfig('maxKbps', kbps);
        this.saveConfig();
    }

    maxKbpsView() {
        let config = appConfiguration.getConfig();

        let options = [6000, 320, 192, 128].map(
            kbps => ({ name: kbps + 'kbps', value: kbps, selected: config.maxKbps == kbps }));

        let selectView = <Select
            namespace='configuration-maxkbps'
            options={options}
            onchange={this.setMaxKbps} />;

        return (
            <div className='row'>
                <Title name='Maximum Kbps' />
                <div className='description'>
                    The Maximum Kbps for All Songs and Episodes.
                </div>

                {selectView}
            </div>
        );
    }

    render() {
        let proxyView = this.proxyView();
        let maxKbpsView = this.maxKbpsView();

        return (
            <div className='contentSpacing'>
                <div className='container-fluid container-fluid--noSpaceAround'>
                    {proxyView}
                    {maxKbpsView}
                </div>
            </div>
        );
    }
}
