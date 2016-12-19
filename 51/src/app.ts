import * as d3 from 'd3';
let width = 800;
let height = 830;
let green = '#84B082';
let red = '#885A5A';

let svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
    
let plotMargins = {
    top: 50,
    bottom: 30,
    left: 120,
    right: 30
};
let plotGroup = svg.append('g')
    .classed('plot', true)
    .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);

let plotWidth = width - plotMargins.left - plotMargins.right;
let plotHeight = height - plotMargins.top - plotMargins.bottom;

d3.csv('data/data.csv', (d: any) => {
    return d;
}, (error: any, data: Array<any>) => {
    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }
});