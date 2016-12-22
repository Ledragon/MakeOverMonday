import * as d3 from 'd3';
import { map } from './map';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

export var mom47 = {
    name: 'mom47',
    component: {
        templateUrl: 'mom/47/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    let width = 960;
    let height = 480;

    let plotMargins = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };
    let p = plot.plot('#chart', width, height, plotMargins);
    let plotGroup = p.group();
    let plotHeight = p.height();
    let plotWidth = p.width();
    var myMap = new map(plotGroup, width, height);
    csvService.read<any>('mom/47/data/data.csv', update);

    function update(data: Array<any>) {
        let byState = d3.nest<any>()
            .key(d => d['Origin State'])
            .entries(data);
        myMap.update(byState);
    }
}