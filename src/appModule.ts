import * as angular from 'angular';
import * as uiRouter from 'angular-ui-router';

import { momName } from './mom/momModule';

import { momList } from './momList/component';
let appModule = angular.module('app', [uiRouter.toString(), momName])
    .component(momList.name, momList.component);

export const name = appModule.name;
