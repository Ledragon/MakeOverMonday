import * as angular from 'angular';

import { mom51 } from './51/component';
import { mom51State } from './51/state';

export const momName = angular.module('momModule', [])
    .config(($stateProvider: angular.ui.IStateProvider) => {
        $stateProvider.state(mom51State);
    })    
    .component(mom51.name, mom51.component)
    .name;