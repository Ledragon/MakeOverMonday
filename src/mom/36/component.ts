import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

export var mom36 = {
    name: 'mom36',
    component: {
        templateUrl: 'mom/36/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    const width = 960;
    const height = 480;
    let plotMargins = {
        top: 50,
        bottom: 30,
        left: 80,
        right: 30
    };

    let p = plot.plot('#chart', width, height, plotMargins);
    let plotGroup = p.group();
    let plotHeight = p.height();
    let plotWidth = p.width();

    
    const fileName = 'mom/36/data/Alan Rickman.csv';
    csvService.read<any>(fileName, update);

    function update(data: Array<any>) {
        console.log(data);
    };
}

import * as angular from 'angular';

import { init } from './directives/movies.directive';
import { init as scoresInit } from './directives/scores.directive';
import { init as vsInit } from './directives/tomatoVSaudience.directive';
import { init as agInit } from './directives/adjustedGross.directive';
import { init as thInit } from './directives/theatres.directive';


let mod = angular.module('mom36', []);
vsInit(mod);
scoresInit(mod);
agInit(mod);
thInit(mod);