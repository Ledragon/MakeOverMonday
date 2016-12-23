import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

import { dataFormat } from './dataFormat';
import { evolution } from './charts/evolution';

export var mom30 = {
    name: 'mom30',
    component: {
        templateUrl: 'mom/30/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {

    var census = createChart('chart', 800, 600, true);
    var menuContainer = d3.select('#menu');

    let parseFunction = d => {
        return {
            category: d['Category'],
            year: +d['Year'],
            total: +d['Total'],
            male: d['Male'] ? +d['Male'] : null,
            female: d['Female'] ? +d['Female'] : null
        };
    };
    const fileName = 'mom/30/data/Bermuda-Digest-of-Statistics.csv';
    csvService.read<any>(fileName, update, parseFunction);

    function update(data: Array<any>) {
        var byCategory = d3.nest<dataFormat>()
            .key(d => d.category)
            .entries(data);
        var menuItems = menuContainer.selectAll('.menu-item')
            .data(byCategory);
        menuItems
            .exit()
            .remove();
        var enterSelection = menuItems
            .enter()
            .append('div')
            .classed('menu-item', true)
            .on('click', function (d, i) {
                d3.selectAll('.menu-item').style('background', '');
                d3.select(this).style('background', 'beige')
                census.titleText(d.key);
                census.update(d.values);
            });
        enterSelection.append('span')
            .text(d => d.key);
    };


    function createChart(containerId: string, width: number, height: number, showGender: boolean): evolution {
        var container = d3.select(`#${containerId}`)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        var c = new evolution(container, width, height);
        c.showGender(showGender);
        return c;
    }
}