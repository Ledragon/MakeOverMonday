import * as d3 from 'd3';
import { map } from './map';

export var mom47 = {
    name: 'mom47',
    component: {
        templateUrl: 'mom/47/template.html',
        controller: controller
    }
}

function controller() {
    let width = 960;
    let height = 480;
    let svg = d3.select('#chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    let plotMargins = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };
    let plotGroup = svg.append('g')
        .classed('plot', true)
        .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);

    let plotWidth = width - plotMargins.left - plotMargins.right;
    let plotHeight = height - plotMargins.top - plotMargins.bottom;
    var myMap = new map(plotGroup, width, height);

    d3.csv('mom/47/data/data.csv', (error, data) => {
        if (error) {
            console.error(error);
        } else {
            let byState = d3.nest<any>()
                .key(d => d['Origin State'])
                .entries(data);
            myMap.update(byState);
        }
    });
}