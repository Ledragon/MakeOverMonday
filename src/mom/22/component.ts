import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

import { brush as appBrush } from './charts/brush';
import { histogram as apphistogram } from './charts/histogram';
import { map as appmap } from './charts/map';
import { womenPerIndustry as appwomenPerIndustry } from './charts/womenPerIndustry';
import { viewPerYearOfBirth as appviewPerYearOfBirth } from './charts/viewPerYearOfBirth';

export var mom22 = {
    name: 'mom22',
    component: {
        templateUrl: 'mom/22/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    var width = 800;
    var height = 350;
    d3.select('#chart')
        .append('svg')
        .attr('id', 'histogram');

    d3.select('#chart')
        .append('svg')
        .attr('id', 'map');

    d3.select('#chart')
        .append('svg')
        .attr('id', 'other');
    // d3.select('#chart')
    //     .append('div')
    //     .attr('id', 'perYear')
    //     .style('border', '1px black solid')
    //     .style('float', 'left');
    var histogram = new apphistogram('histogram', width, height);
    var map = new appmap('map', width, height, 'common-data/world.json');
    var perYear = new appviewPerYearOfBirth('chart', width, height);
    var perIndustry = new appwomenPerIndustry('other', width, height);

    
    d3.select('#chart')
        .append('svg')
        .attr('id', 'brush')
        .style('border', '1px black solid');
    var brush = new appBrush('brush', 1606, 50);

    const fileName = 'mom/22/data/History of Famous People.csv';
    csvService.read<any>(fileName, data => {

        brush.dispatch().on('brushed', extent => {
            var filtered = data.filter(function (d) {
                return +d.Birthyear >= extent[0] && +d.Birthyear <= extent[1];
            });
            update(filtered);
        })
        update(data);
    });

    function update(data: Array<any>) {
        brush.update(data);
        histogram.update(data);
        map.update(data);
        perIndustry.update(data);
        perYear.update(data);
    };
}