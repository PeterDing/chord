'use strict';

import * as React from 'react';


export interface IProcessBarProps {
    playing: boolean;
    handleSeek: (e: React.MouseEvent<HTMLDivElement>, box: HTMLDivElement) => any;
}
