import * as d3 from 'd3';
let width = 800;
let height = 800;

let svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
svg.append('marker')
    .attr('id', 'head')
    .attr('orient', 'auto')
    .attr('markerWidth', 2)
    .attr('markerHeight', 2)
    .append('path')
    .attr('d', 'M0,0 V4 L2, 2Z');
let plotMargins = {
    top: 30,
    bottom: 30,
    left: 30,
    right: 30
};
let plotGroup = svg.append('g')
    .classed('plot', true)
    .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);

let plotWidth = width - plotMargins.left - plotMargins.right;
let plotHeight = height - plotMargins.top - plotMargins.bottom;

d3.csv('data/data.csv', (d: any) => {
    return {
        state: d.State,
        fatalities: parseInt(d['Fatalities Rate per 100 Million Vehicle Miles Traveled']),
        failureToObey: parseInt(d['Failure to Obey']),
        drunkDriving: parseInt(d['Drunk Driving']),
        speeding: parseInt(d['Speeding']),
        carelessDriving: parseInt(d['Careless Driving']),
        totalScore: parseInt(d['Total Score']),
        rank: parseInt(d['Rank']),
    };
}, (error: any, data: Array<any>) => {
    if (error) {
        console.error(error);
    } else {
        var sorted = data.sort((a, b) => a.rank - b.rank);
    }
});