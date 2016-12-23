import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

import { rawData } from './models/data';
import { draw } from './charts/map';
import { timeline } from './charts/timeline';

export var mom34 = {
    name: 'mom34',
    component: {
        templateUrl: 'mom/34/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    let w = 800;
    let h = 600;
    let map = d3.select('#map')
        .append('svg')
        .attr('width', w)
        .attr('height', h);

    let mapChart = draw(map, w, h);

    let timelineContainer = d3.select('#timeline');
    let timelineChart = timeline(timelineContainer, 200, 200);

    const fileName = 'mom/34/data/Malaria.csv';
    csvService.read<any>(fileName, update);

    function update(data: rawDataObject) {
        timelineChart.clickCallback(year => {
            var mapped = data.map(d => {
                return {
                    name: d.Country,
                    value: +d[year]
                }
            });
            mapChart.update(mapped);
        });
        timelineChart.update(data.columns.splice(1, data.columns.length));
    };
}

interface rawDataObject extends Array<rawData> {
    columns: Array<string>;
}