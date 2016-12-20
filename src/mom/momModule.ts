import * as angular from 'angular';

import { mom49 } from './49/component';
import { mom49State } from './49/state';
import { mom50 } from './50/component';
import { mom50State } from './50/state';
import { mom51 } from './51/component';
import { mom51State } from './51/state';

export const momName = angular.module('momModule', [])
    .config(($stateProvider: angular.ui.IStateProvider) => {
        $stateProvider.state(mom49State);
        $stateProvider.state(mom50State);
        $stateProvider.state(mom51State);
    })    
    .component(mom49.name, mom49.component)
    .component(mom50.name, mom50.component)
    .component(mom51.name, mom51.component)
    .name;