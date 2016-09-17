import * as angular from 'angular';

import { init } from './directives/movies.directive';
import { init as scoresInit } from './directives/scores.directive';
import { init as vsInit } from './directives/tomatoVSaudience.directive';
import { init as agInit } from './directives/adjustedGross.directive';


angular.module('app', []);
vsInit();
scoresInit();
agInit();