'use strict';

import { IEpisode } from 'chord/sound/api/episode';
import { IPodcast } from 'chord/sound/api/podcast';
import { IRadio } from 'chord/sound/api/radio';


export type TSoundItems = IEpisode | IPodcast | IRadio;
