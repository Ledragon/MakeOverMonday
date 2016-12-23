import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

import { chart } from './chart';
import { dataFormat } from './dataFormat';

export var mom33 = {
    name: 'mom33',
    component: {
        templateUrl: 'mom/33/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {

    var w = 800;
    var h = 600;

    let svg = d3.select('#chart')
        .append('svg')
        .attr('width', w)
        .attr('height', h);
    let c = new chart(svg, w, h);

    let parseFunction = (d) => {
        return {
            category: d.Category,
            product: d.Product,
            current: d['2014'],
            previous: d['2013'],
            'change': parseFloat(d['% Change']) / 100
        };
    };
    const fileName = 'mom/33/data/data.csv';
    csvService.read<any>(fileName, update, parseFunction);

    function update(data: Array<any>) {
        c.update(data);

    };
}