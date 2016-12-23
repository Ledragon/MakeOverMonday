import * as angular from 'angular';
import * as uiRouter from 'angular-ui-router';

import { momName } from './mom/momModule';

import { momHeading } from './momHeading/component';
import { momList } from './momList/component';
import { register as galleryRegister } from './gallery/state';

import { CsvService } from './services/csvService';
let appModule = angular.module('app', [uiRouter.toString(), momName, 'mom36'])
    .component(momHeading.name, momHeading.component)
    .component(momList.name, momList.component)
    .service('csvService', () => new CsvService());
galleryRegister(appModule);
export const name = appModule.name;
