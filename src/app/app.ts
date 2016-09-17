import * as angular from 'angular';

import { init } from './directives/movies.directive';
import { init as scoresInit } from './directives/scores.directive';


angular.module('app', []);
scoresInit();