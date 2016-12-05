import { csv } from 'd3-request';
import { select, Selection } from 'd3-selection';
import { nest } from 'd3-collection';
import { map } from './map';
let width=960;
let height = 480;
let svg = select('#chart')
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

csv('data/data.csv', (error, data) => {
    if (error) {
        console.error(error);
    } else {
        let byState = nest<any>()
            .key(d => d['Origin State'])
            .entries(data);
        console.log(byState);
        myMap.update(byState);
    }
});