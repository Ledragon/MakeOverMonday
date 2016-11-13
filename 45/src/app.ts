import { select } from 'd3-selection';
import { csv } from 'd3-request';
import { timeParse } from 'd3-time-format';
import { nest } from 'd3-collection';
import { scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { extent, histogram, range } from 'd3-array';
import { interpolateGreens } from 'd3-scale-chromatic';

let width = 600;
let height = 800;

let svg = select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
let histGenerator = histogram<Idata, any>()
    .value((d: Idata) => d.score)
    .thresholds(range(0, 100, 1));

let parser = timeParse('%d-%m-%y');
let colorScale = scaleLinear()
    .range([0, 1]);
csv<any>('data/Restaurant_Inspection_Scores.csv', (d: any) => {
    return {
        restaurant: d['Restaurant Name'],
        date: parser(d['Inspection Date']),
        score: parseFloat(d['Score'])
    }
}, (error: any, data: Array<Idata>) => {
    if (error) {
        console.error(error)
    } else {
        let byYear = nest<Idata>()
            .key(d => d.date.getFullYear().toString())
            .entries(data)
            .sort((a,b)=>parseInt(a.key)-parseInt(b.key));

        let current = byYear[1];
        svg.selectAll('.plot')
            .data(byYear)
            .enter()
            .each(function (d, i) {
                let group = select(this)
                    .append('g')
                    .attr('transform', `translate(${0},${i * height / 4})`)
                plot(group, width, height / 4, d);
            })

    }
})

function plot(container: any, width: number, height: number, current: any) {
    container.append('g')
        .classed('title', true)
          .attr('transform', `translate(${width/2},${30})`)
        .append('text')
        .text(current.key);    
    let plotMargins = {
        top: 30,
        bottom: 30,
        left: 30,
        right: 30
    };
    let plotGroup = container.append('g')
        .classed('plot', true)
        .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);

    let plotWidth = width - plotMargins.left - plotMargins.right;
    let plotHeight = height - plotMargins.top - plotMargins.bottom;
    var binned = histGenerator(current.values);

    let xScale = scaleLinear()
        .domain([0, 100])
        .range([0, plotWidth])
    let xAxis = axisBottom(xScale);
    let xAxisGroup = plotGroup.append('g')
        .classed('axis', true)
        .call(xAxis)
        .attr('transform', `translate(${0},${plotHeight})`);
    let yScale = scaleLinear()
        .domain(extent(binned, b => b.length))
        .range([plotHeight, 0]);

    let seriesGroup = plotGroup.append('g')
        .classed('series-group', true);
    colorScale.domain(yScale.domain());
    var dataBound = seriesGroup.selectAll('.seriesGroup')
        .data(binned);
    dataBound
        .exit()
        .remove();
    let enterSelection = dataBound
        .enter()
        .append('g')
        .classed('seriesGroup', true)
        .attr('transform', (d: any) => `translate(${xScale(d.x0)},${0})`);
    var rect = enterSelection.append('rect')
        .attr('x', 0)
        .attr('y', d => yScale(d.length))
        .attr('width', 5)
        .attr('height', d => plotHeight - yScale(d.length))
        .style('fill', d => interpolateGreens(colorScale(d.length)));

}



interface Idata {
    restaurant: string;
    date: Date;
    score: number;
}