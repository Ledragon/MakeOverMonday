import * as d3 from 'd3';
let width = 800;
let height = 830;
let green = '#84B082';
let red = '#885A5A';

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
        let statesScale = d3.scaleBand()
            .domain(sorted.map(d => d.state))
            .range([0, plotHeight])
            .padding(.3);
        let statesAxis = d3.axisLeft(statesScale);
        let statesAxisGroup = plotGroup.append('g')
            .classed('axis', true)
            .call(statesAxis);
        let scoreScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.totalScore)])
            .range([0, plotWidth]);
        let colorScale = d3.scaleLinear<any>()
            .domain(d3.extent(data, d => d.totalScore))
            .range([d3.rgb(green), d3.rgb(red)])
            .interpolate(d3.interpolateHcl);
        plotGroup.selectAll('g.score')
            .data(sorted)
            .enter()
            .append('g')
            .classed('score', true)
            .attr('transform', d => `translate(${0},${statesScale(d.state)})`)
            .append('rect')
            .attr('width', d=>scoreScale(d.totalScore))
            .attr('height', statesScale.bandwidth())
        .style('fill', d=>colorScale(d.totalScore))
    }
});