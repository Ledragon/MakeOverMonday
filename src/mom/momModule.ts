import * as angular from 'angular';

import { mom46 } from './46/component';
import { mom46State } from './46/state';
import { mom47 } from './47/component';
import { mom47State } from './47/state';
import { mom48 } from './48/component';
import { mom48State } from './48/state';

import { mom49 } from './49/component';
import { mom49State } from './49/state';
import { mom50 } from './50/component';
import { mom50State } from './50/state';
import { mom51 } from './51/component';
import { mom51State } from './51/state';

export const momName = angular.module('momModule', [])
    .config(($stateProvider: angular.ui.IStateProvider) => {
        $stateProvider.state(mom46State);
        $stateProvider.state(mom47State);
        $stateProvider.state(mom48State);
        $stateProvider.state(mom49State);
        $stateProvider.state(mom50State);
        $stateProvider.state(mom51State);
    })    
    .component(mom46.name, mom46.component)
    .component(mom47.name, mom47.component)
    .component(mom48.name, mom48.component)
    .component(mom49.name, mom49.component)
    .component(mom50.name, mom50.component)
    .component(mom51.name, mom51.component)
    .name;