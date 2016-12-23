import * as angular from 'angular';

import { register as register30 } from './30/state';
import { register as register31 } from './31/state';
import { register as register32 } from './32/state';
import { register as register33 } from './33/state';
import { register as register34 } from './34/state';
import { register as register35 } from './35/state';
import { register as register36 } from './36/state';
import { register as register37 } from './37/state';
import { register as register38 } from './38/state';
import { register as register39 } from './39/state';
import { register as register40 } from './40/state';
import { register as register41 } from './41/state';
import { mom42 } from './42/component';
import { mom42State } from './42/state';
import { mom43 } from './43/component';
import { mom43State } from './43/state';
import { mom44 } from './44/component';
import { mom44State } from './44/state';
import { mom45 } from './45/component';
import { mom45State } from './45/state';
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

let momModule = angular.module('momModule', []);
register30(momModule);
register31(momModule);
register32(momModule);
register33(momModule);
register34(momModule);
register35(momModule);
register36(momModule);
register37(momModule);
register38(momModule);
register39(momModule);
register40(momModule);
register41(momModule);

export const momName = momModule
    .config(($stateProvider: angular.ui.IStateProvider) => {
        $stateProvider.state(mom42State);
        $stateProvider.state(mom43State);
        $stateProvider.state(mom44State);
        $stateProvider.state(mom45State);
        $stateProvider.state(mom46State);
        $stateProvider.state(mom47State);
        $stateProvider.state(mom48State);
        $stateProvider.state(mom49State);
        $stateProvider.state(mom50State);
        $stateProvider.state(mom51State);
    })    
    .component(mom42.name, mom42.component)
    .component(mom43.name, mom43.component)
    .component(mom44.name, mom44.component)
    .component(mom45.name, mom45.component)
    .component(mom46.name, mom46.component)
    .component(mom47.name, mom47.component)
    .component(mom48.name, mom48.component)
    .component(mom49.name, mom49.component)
    .component(mom50.name, mom50.component)
    .component(mom51.name, mom51.component)
    .name;