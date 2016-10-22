import { select, selectAll } from 'd3-selection';
import { queue } from 'd3-queue';
import { csv, json } from 'd3-request';
import { geoAlbersUsa } from 'd3-geo';
import { nest } from 'd3-collection';
import { scaleBand, scaleTime, scaleLinear } from 'd3-scale';
import { axisLeft, axisTop } from 'd3-axis';
import { line, area } from 'd3-shape';
import { timeParse } from 'd3-time-format';
import { extent } from 'd3-array';

let width = 1900;
let height = 780;
let container = select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

let margins = {
    top: 120,
    bottom: 20,
    left: 20,
    right: 20
};

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
        // console.log(mapped);
        let byCountry = nest()
            .key(d => d.state)
            .entries(mapped);

        let scale = scaleBand()
            // .range([0, height - margins.top - margins.bottom])
            .range([0, width - margins.left - margins.right])
            .domain(byCountry.map(d => d.key));
        let leftAxis = axisTop(scale);
        let plotGroup = container.append('g')
            .classed('container', true)
            .attr('transform', `translate(${margins.left},${margins.top})`);
        let axis = plotGroup.append('g')
            .classed('top-axis', true)
            .call(leftAxis);
        axis.selectAll('.tick')
            .select('text')
            .style('text-anchor', 'start')
            .attr('transform', `rotate(${-90}) translate(10,${10})`);
        let bandWidth = scale.bandwidth()*.75;
        let seriesGroup = plotGroup.append('g')
            .classed('series', true);
        let enterSelection = seriesGroup.selectAll('g.country')
            .data(byCountry)
            .enter()
            .append('g')
            .classed('country', true)
            .attr('transform', (d, i) => `translate(${scale(d.key) },${0})`);
        let timeScale = scaleTime()
            .domain(extent(mapped, d => d.date))
            .range([0, height - margins.top - margins.bottom]);
        let xScale = scaleLinear()
            .domain([0, 1])
            .range([0, bandWidth]);
        let lineGenerator = line()
            .x(d => {
                // console.log(xScale(d.clinton))
                return xScale(d.clinton)
            })
            .y(d => {
                console.log(timeScale(d.date));
                return timeScale(d.date);
            })
        // dataBound.append('path')
        //     .attr('d', d => {
        //         // console.log(d.values);
        //         return lineGenerator(d.values);
        //     });
        enterSelection.selectAll('circle.clinton')
            .data(d => d.values)
            .enter()
            .append('circle')
            .classed('clinton', true)
            .attr('r', 2)
            .attr('cx', d => xScale(d.clinton))
            .attr('cy', d => timeScale(d.date));
        enterSelection.selectAll('circle.trump')
            .data(d => d.values)
            .enter()
            .append('circle')
            .classed('trump', true)
            .attr('r', 2)
            .attr('cx', d => xScale(d.clinton)+xScale(d.trump))
            .attr('cy', d => timeScale(d.date));

    }
})