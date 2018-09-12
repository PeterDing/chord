'use strict';

import * as React from 'react';


export interface IVolumeBarProps {
    volume: number;
    handleVolume: (e: React.MouseEvent<HTMLDivElement>, box: HTMLDivElement) => any;
}
