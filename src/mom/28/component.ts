import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

import { chart } from './chart';
import { dataFormat } from './models/dataFormat';
export var mom28 = {
    name: 'mom28',
    component: {
        templateUrl: 'mom/28/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    var width = 1400;
    var height = 600;
    var div = d3.select('#chart');
    var container = div.append('svg')
        .attr('width', width)
        .attr('height', height);
    var c = new chart(container, width, height);

    const fileName = 'mom/28/data/Orlando Mass Shooting.csv';
    csvService.read<any>(fileName, update);

    function update(data: Array<any>) {
        c.update(data);

    };
}