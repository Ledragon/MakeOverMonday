import * as angular from 'angular';
import * as uiRouter from 'angular-ui-router';

import { momName } from './mom/momModule';

let appModule = angular.module('app', [uiRouter.toString(), momName]);

export const name = appModule.name;
