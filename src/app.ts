import { select, selectAll } from 'd3-selection';
import { queue } from 'd3-queue';
import { csv, json } from 'd3-request';
import { geoAlbersUsa } from 'd3-geo';
import { nest } from 'd3-collection';
import { scaleBand, scaleTime, scaleLinear } from 'd3-scale';
import { axisLeft, axisTop, axisBottom } from 'd3-axis';
import { line, area, stack } from 'd3-shape';
import { timeParse } from 'd3-time-format';
import { extent, sum, mean } from 'd3-array';

let width = 1900;
let height = 780;
let margins = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
};

let container = select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
let plotGroup = container.append('g')
    .classed('container', true)
    .attr('transform', `translate(${margins.left},${margins.top})`);

let plotWidth = width - margins.left - margins.right;
let plotHeight = height - margins.top - margins.bottom;

let seriesGroup = plotGroup.append('g')
    .classed('series', true);


let colors = ['red', 'blue', 'green', 'gray'];
let timeParser = timeParse('%d-%m-%y')
var q = queue()
    .defer(csv, 'data/Votamatic.csv')
    .defer(json, 'data/us.geo.json');
q.awaitAll((error, responses) => {
    if (error) {
        console.error(error);
    }
    else {
        let mapped = responses[0]
            .map(d => {
                return {
                    state: d.State,
                    clinton: parseFloat(d.Clinton),
                    trump: parseFloat(d.Trump),
                    other: parseFloat(d.Other),
                    undecided: parseFloat(d.Undecided),
                    date: timeParser(d.Date)
                }
            })

        let byDate = nest()
            .key(d => d.date)
            .entries(mapped)
            .map(d => {
                return {
                    date: new Date(d.key),
                    clinton: mean(d.values, v => v.clinton),
                    trump: mean(d.values, v => v.trump),
                    other: mean(d.values, v => v.other),
                    undecided: mean(d.values, v => v.undecided),
                }
            });

        let timeScale = scaleTime()
            .domain(extent(byDate, d => d.date))
            .range([0, plotWidth]);

        let yScale = scaleLinear()
            .domain([0, 1])
            .range([plotHeight, 0]);

        let timeAxis = axisBottom(timeScale);
        let timeAxisGroup = plotGroup.append('g')
            .classed('time-axis', true)
            .attr('transform', `translate(${0},${plotHeight})`)
            .call(timeAxis);
        let stackGenerator = stack()
            .keys(byDate.map(d => d.date));
        let stacked = stackGenerator(byDate);
        console.log(stacked);
        // seriesGroup.selectAll('circle.clinton')
        //     .data(byDate)
        //     .enter()
        //     .append('circle')
        //     .classed('clinton', true)
        //     .attr('r', 2)
        //     .attr('cx', d => timeScale(d.date))
        //     .attr('cy', d => yScale(d.clinton))
        // seriesGroup.selectAll('circle.trump')
        //     .data(byDate)
        //     .enter()
        //     .append('circle')
        //     .classed('trump', true)
        //     .attr('r', 2)
        //     .attr('cx', d => timeScale(d.date))
        //     .attr('cy', d => yScale(d.trump) - yScale(d.clinton))

    }
})