import { select } from 'd3-selection';
import { csv } from 'd3-request';
import { scaleOrdinal, scaleBand, scaleLinear } from 'd3-scale';
import { axisLeft, axisTop } from 'd3-axis';
import { extent, max } from 'd3-array';
import { interpolateRdYlBu } from 'd3-scale-chromatic';
import * as _ from 'lodash';

let width = 960;
let height = 600;

let svg = select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

let plotMargins = {
    top: 30,
    bottom: 30,
    left: 150,
    right: 30
};
let plotGroup = svg.append('g')
    .classed('plot', true)
    .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);

let plotWidth = width - plotMargins.left - plotMargins.right;
let plotHeight = height - plotMargins.top - plotMargins.bottom;

csv('data/Scottish Index of Multiple Deprivation 2012.csv', (error: any, data: Array<any>) => {
    let authorities = _.chain(data).map(d => d['Local Authority Name']).uniq().value();
    let authorityScale = scaleBand<any>()
        .range([0, plotHeight])
        .domain(authorities);
    let authoritiesAxis = axisLeft(authorityScale);
    let authorityAxisGroup = plotGroup.append('g')
        .classed('axis', true);
    authorityAxisGroup.call(authoritiesAxis);

    let rankScale = scaleLinear()
        .range([0, plotWidth])
        .domain([0, max(data, d => parseFloat(d['Overall SIMD 2012 Rank']))]);
    let rankAxis = axisTop(rankScale);
    let rankAxisGroup = plotGroup.append('g')
        .classed('axis', true);
    rankAxisGroup.call(rankAxis);

    let seriesGroup = plotGroup.append('g')
        .classed('series-group', true);
    let dataBound = seriesGroup.selectAll('.series')
        .data(data);
    dataBound.exit().remove();
    let enterSelection = dataBound.enter()
        .append('g')
        .classed('series', true);
    let colorScale = scaleLinear()
        .range([0, 1])
        .domain(rankScale.domain());    
    enterSelection.append('circle')
        .attr('r', 2)
        .attr('cx', d => rankScale(parseFloat(d['Overall SIMD 2012 Rank'])))
        .attr('cy', d => authorityScale(d['Local Authority Name']) + authorityScale.bandwidth() / 2)
        .style('fill', d=>interpolateRdYlBu(colorScale(parseFloat(d['Overall SIMD 2012 Rank']))));
})