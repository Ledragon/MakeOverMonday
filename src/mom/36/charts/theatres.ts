import * as d3 from 'd3';
import { IDate } from './Idate';
import { IMargins } from './IMargins';
import { group } from './group';
import { colors } from './colors';

var _marginTop = 50;

export function chart(selection: d3.Selection<any, any, any, any>, width: number, height: number, data: Array<any>) {
    var byDate = data.sort((a, b) => d3.descending(a.theatres, b.theatres));

    var chartMargins: IMargins = { top: 10, bottom: 10, left: 10, right: 10 };
    var chart = new group(selection, width, height, chartMargins, 'chart-group');
    var expectedWidth = 400;
    let marginLeft = 250;
    var plotMargins: IMargins = { top: _marginTop, bottom: 0, left: marginLeft, right: 0 };
    var plot = new group(chart.group(), chart.width(), chart.height(), plotMargins, 'plot-group');

    var moviesScale = d3.scaleBand<any>()
        .domain(byDate.map(d => d.title))
        .range([0, plot.height()])
        .padding(0.25);

    var movieAxis = d3.axisLeft(moviesScale);
    var movieAxisGroup = plot.group()
        .append('g')
        .classed('time-axis', true)
        .call(movieAxis);
    var color = 'rgba(241, 232, 184, 1)';
    movieAxisGroup.select('path.domain')
        .attr('stroke', color)
    var ticks = movieAxisGroup.selectAll('.tick');
    ticks.select('line')
        .attr('stroke', color);
    ticks.select('text')
        .attr('fill', color);
    drawProfits(plot.group(), plot.width(), plot.height(), moviesScale, data);

    var fmt = d3.format('2.0f');    
    chart.group()
        .append('g')
        .classed('title', true)
        .attr('transform', `translate(${plotMargins.left + plot.width() / 2},${30})`)
        .append('text')
        .text(`Theatres (average: ${fmt(d3.mean(byDate, d=>d.theatres))})`)
        .attr('text-anchor', 'middle')
        .attr('fill', color)
}

function drawProfits(selection: d3.Selection<any, any, any, any>, width: number, height: number, scale: d3.ScaleBand<string>, data: Array<any>) {
    var group = selection.append('g')
        .classed('series', true)
        .attr('transform', `translate(${0},${0})`);
    var dataBound = group.selectAll('.item')
        .data(data);
    dataBound
        .exit()
        .remove();
    var scoreScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.theatres)])
        .range([0, width]);
    var enterSelection = dataBound
        .enter()
        .append('g')
        .classed('item', true)
        .attr('transform', d => `translate(${0},${scale(d.title)})`);
    enterSelection.append('rect')
        .attr('width', d => scoreScale(d.theatres))
        .attr('height', scale.bandwidth())
        .style('fill', colors[3]);
}