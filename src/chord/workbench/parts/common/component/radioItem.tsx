'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { getUserProfileCount } from 'chord/workbench/api/utils/statistic';

import { ESize } from 'chord/music/common/size';

// import { handleShowRadioView } from 'chord/workbench/parts/mainView/browser/action/showRadio';
import { handleShowRadioView } from 'chord/workbench/parts/mainView/browser/action/showRadio';
import { showRadioMenu } from 'chord/workbench/parts/menu/browser/action/menu';

// import { showRadioMenu } from 'chord/workbench/parts/menu/browser/action/menu';

// import { IRadio } from 'chord/music/api/user';
// import { IShowRadioAct } from 'chord/workbench/api/common/action/mainView';
// import { IPlayUserFavoriteSongsAct } from 'chord/workbench/api/common/action/player';
// import { IShowRadioMenuAct } from 'chord/workbench/api/common/action/menu';

import { IRadio } from 'chord/sound/api/radio';

import { Card } from 'chord/workbench/parts/common/abc/card';

import { RadioIcon } from 'chord/workbench/parts/common/component/common';
import { PlayIcon } from 'chord/workbench/parts/common/component/common';

import { OriginIcon } from 'chord/workbench/parts/common/component/originIcons';

import { soundApi } from 'chord/sound/core/api';


interface IRadioItemViewProps {
    radio: IRadio;

    handleShowRadioView: (radio) => void;
    showRadioMenu: (e: React.MouseEvent<HTMLDivElement>, radio) => void;
}


class RadioItemView extends React.Component<IRadioItemViewProps, any> {

    constructor(props: IRadioItemViewProps) {
        super(props);
    }

    render() {
        let radio = this.props.radio;
        let cover = radio.radioCoverPath || soundApi.resizeImageUrl(radio.origin, radio.radioCoverUrl, ESize.Middle);
        let originIcon = OriginIcon(radio.origin, 'cover-icon xiami-icon');
        let radioCount = getUserProfileCount(radio);

        let name = (<span>{originIcon} {radio.radioName}</span>);

        let infos = [
            { item: radioCount },
        ];

        return <Card
            name={name}
            cover={{ item: cover, act: () => this.props.handleShowRadioView(radio) }}
            defaultCover={RadioIcon}
            menu={(e) => this.props.showRadioMenu(e, radio)}
            button={null}
            infos={infos}
            draggable={true}
            shape={'circle'} />;
    }
}


function mapDispatchToProps(dispatch) {
    return {
        handleShowRadioView: radio => handleShowRadioView(radio).then(act => dispatch(act)),
        showRadioMenu: (e, radio) => dispatch(showRadioMenu(e, radio)),
    };
}

export default connect(null, mapDispatchToProps)(RadioItemView);
