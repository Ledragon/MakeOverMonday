import * as angular from 'angular';
import * as uiRouter from 'angular-ui-router';

import { momName } from './mom/momModule';

import { momList } from './momList/component';
import { CsvService } from './services/csvService';
let appModule = angular.module('app', [uiRouter.toString(), momName])
    .component(momList.name, momList.component)
    .service('csvService', () => new CsvService());

export const name = appModule.name;
