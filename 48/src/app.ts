import * as d3 from 'd3';
let width = 960;
let height = 480;

let svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

let plotMargins = {
    top: 30,
    bottom: 30,
    left: 50,
    right: 30
};
let plotGroup = svg.append('g')
    .classed('plot', true)
    .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);

let plotWidth = width - plotMargins.left - plotMargins.right;
let plotHeight = height - plotMargins.top - plotMargins.bottom;


let xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, plotWidth])
let xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format('0.0f'));

let xAxisGroup = plotGroup.append('g')
    .classed('axis', true)
    .attr('transform', `translate(${0},${plotHeight})`)
    .call(xAxis);

let yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([plotHeight, 0]);
let yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.format('2.0%'));
let yAxisGroup = plotGroup.append('g')
    .classed('axis', true)
    .attr('transform', `translate(${0},${0})`)
    .call(yAxis);

let lineGeneratorBottom90 = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.bottom90));
let lineGeneratorTop10 = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.top10));


d3.csv('data/Inequality.csv', (d: any) => {
    let par = (dd: string) => { return dd ? parseFloat(dd.replace('%', '')) / 100 : null; };
    return {
        year: parseInt(d.Year),
        bottom90: par(d['Bottom 90%']),
        top10: par(d['Top 10%'])
    };
}, (error: any, data: Array<any>) => {
    if (error) {
        console.error(error);
    } else {
        data = data.filter(d => !!d.bottom90);
        // console.log(data);
        xScale.domain(d3.extent(data, d => d.year));
        xAxisGroup.call(xAxis);
        plotGroup.append('path')
            .classed('bottom-90', true)
            // .data(data)
            .attr('d', lineGeneratorBottom90(data));
        plotGroup.append('path')
            .classed('top-10', true)
            // .data(data)
            .attr('d', lineGeneratorTop10(data));
    }
});