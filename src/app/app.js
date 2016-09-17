"use strict";
var angular = require('angular');
var scores_directive_1 = require('./directives/scores.directive');
var tomatoVSaudience_directive_1 = require('./directives/tomatoVSaudience.directive');
var adjustedGross_directive_1 = require('./directives/adjustedGross.directive');
var theatres_directive_1 = require('./directives/theatres.directive');
angular.module('app', []);
tomatoVSaudience_directive_1.init();
scores_directive_1.init();
adjustedGross_directive_1.init();
theatres_directive_1.init();
//# sourceMappingURL=app.js.map