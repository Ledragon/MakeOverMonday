import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

import { statistics } from './charts/statistics';
import { chart } from './charts/chart';


interface dataFormat {
    year: number;
    recordsStolen: number;
    recordsLost: number;
    company: string;
}

export var mom38 = {
    name: 'mom38',
    component: {
        templateUrl: 'mom/38/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    // const width = 960;
    // const height = 480;
    // let plotMargins = {
    //     top: 50,
    //     bottom: 30,
    //     left: 80,
    //     right: 30
    // };

    // let p = plot.plot('#chart', width, height, plotMargins);
    // let plotGroup = p.group();
    // let plotHeight = p.height();
    // let plotWidth = p.width();

    var parseFUnction = (d: any) => {
        return {
            year: +d.Year,
            company: d.Entity,
            recordsStolen: +d['Records Stolen'],
            recordsLost: +d['Records Lost']
        }
    };
    const fileName = 'mom/38/data/Data Breaches.csv';
    csvService.read<any>(fileName, update, parseFUnction);

    function update(data: Array<any>) {
        var stats = new statistics(d3.select('#statistics'), 200, 500);
            stats.update(data);

            let chartSelection = d3.select('#chart')
                .append('svg')
                .attr('width', 1200)
                .attr('height', 600)
            var ch = new chart(chartSelection, 1200, 600);
            ch.update(data);
    };
}