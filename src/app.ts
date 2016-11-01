import { select, selectAll } from 'd3-selection';
import { queue } from 'd3-queue';
import { csv, json } from 'd3-request';
import { geoAlbersUsa } from 'd3-geo';
import { nest } from 'd3-collection';
import { scaleBand, scaleTime, scaleLinear } from 'd3-scale';
import { axisLeft, axisTop, axisBottom } from 'd3-axis';
import { line, area, stack } from 'd3-shape';
import { timeParse, timeFormat } from 'd3-time-format';
import { extent, sum, mean } from 'd3-array';

let width = 1900;
let height = 700;
let margins = {
    top: 30,
    bottom: 50,
    left: 20,
    right: 20
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


let stateScale = scaleBand()
    .range([0, plotWidth]);

let stateScaleGroup = plotGroup.append('g')
    .classed('axis', true);

let stateAxis = axisTop(stateScale);

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
            .entries(mapped);
        stateScale.domain(mapped.map(d => d.state));
        stateScaleGroup.call(stateAxis);
        // let timeScale = scaleTime()
        //     .domain(extent(byDate, d => d.date))
        //     .range([0, plotWidth]);

        let yScale = scaleLinear()
            .domain([0, 1])
            .range([0, plotHeight]);
        let dateFormat = timeFormat('%B %d');
        let i = 0;
        setInterval(function () {
        if (i >= byDate.length) {
            i = 0;
        }
        select('#date')
            .select('span')
            .text(dateFormat(new Date(byDate[i].key));
        let databound = seriesGroup.selectAll('.series-individual')
            .data(byDate[i].values);
        let enterSelection = databound
            .enter()
            .append('g')
            .classed('series-individual', true)
            .attr('transform', d => `translate(${stateScale(d.state)},${0})`);
        let rectWidth = stateScale.bandwidth() / 2;
        enterSelection.append('rect')
            .classed('clinton', true)
            .attr('x', rectWidth / 2)
            .attr('y', 0)
            .attr('width', rectWidth)
            .attr('height', d => yScale(d.clinton));
        databound.select('.clinton')
            .attr('x', rectWidth / 2)
            .attr('y', 0)
            .attr('width', rectWidth)
            .attr('height', d => yScale(d.clinton));
        enterSelection.append('rect')
            .classed('trump', true)
            .attr('x', rectWidth / 2)
            .attr('y', d => yScale(d.clinton))
            .attr('width', rectWidth)
            .attr('height', d => yScale(d.trump));
        databound.select('.trump')
            .attr('x', rectWidth / 2)
            .attr('y', d => yScale(d.clinton))
            .attr('width', rectWidth)
            .attr('height', d => yScale(d.trump));
        enterSelection.append('rect')
            .classed('other', true)
            .attr('x', rectWidth / 2)
            .attr('y', d => yScale(d.clinton)+yScale(d.trump))
            .attr('width', rectWidth)
            .attr('height', d => yScale(d.other));
        databound.select('.other')
            .attr('x', rectWidth / 2)
            .attr('y', d => yScale(d.clinton)+yScale(d.trump))
            .attr('width', rectWidth)
            .attr('height', d => yScale(d.other));
        enterSelection.append('rect')
            .classed('undecided', true)
            
            .attr('x', rectWidth / 2)
            .attr('y', d => yScale(d.clinton)+yScale(d.trump)+yScale(d.other))
            .attr('width', rectWidth)
            .attr('height', d => yScale(d.undecided));
        databound.select('.undecided')
            
            .attr('x', rectWidth / 2)
            .attr('y', d => yScale(d.clinton)+yScale(d.trump)+yScale(d.other))
            .attr('width', rectWidth)
            .attr('height', d => yScale(d.undecided));
        databound.exit()
            .remove();
        // console.log(i)
        // databound.select('.clinton')
        //     .attr('x', 0)
        //     .attr('y', 0)
        //     .attr('width', stateScale.bandwidth())
        //     .attr('height', d => yScale(d.clinton));
        i++;
        }, 100);

        // let timeAxis = axisBottom(timeScale);
        // let timeAxisGroup = plotGroup.append('g')
        //     .classed('time-axis', true)
        //     .attr('transform', `translate(${0},${plotHeight})`)
        //     .call(timeAxis);
        // let stackGenerator = stack()
        //     .keys(byDate.map(d => d.date));
        // let stacked = stackGenerator(byDate);
        // console.log(stacked);
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