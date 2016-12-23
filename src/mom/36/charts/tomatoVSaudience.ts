import * as d3 from 'd3';
import { IDate } from './Idate';
import { IMargins } from './IMargins';
import { group } from './group';
import { colors } from './colors';

export function chart(selection: d3.Selection<any, any, any, any>, width: number, height: number, data: Array<any>) {
    var byDate = data.sort((a, b) => d3.ascending(a.title, b.title));

    var chartMargins: IMargins = { top: 10, bottom: 10, left: 10, right: 10 };
    var chart = new group(selection, width, height, chartMargins, 'chart-group');
    var plotMargins: IMargins = { top: 0, bottom: 50, left: 50, right: 0 };
    var plot = new group(chart.group(), chart.width(), chart.height(), plotMargins, 'plot-group');
    var titleSize = 30;
    plot.group()
        .append('g')
        .classed('title', true)
        .classed('title-vertical', true)
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', colors[0])
        .text('Tomatometer score')
        .attr('transform', `translate(${0},${plot.height() / 2}) rotate(-90)`);
    plot.group()
        .append('g')
        .classed('title', true)
        .classed('title-horizontal', true)
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', colors[0])
        .text('Audience score')
        .attr('transform', `translate(${plot.width() / 2},${plot.height()})`);

    var horizScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width-titleSize]);

    var vertScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height-titleSize, 0]);

    let pointsGroup = plot.group()
        .append('g')
        .classed('points', true);
    var dataBound = pointsGroup.selectAll('.point')
        .data(byDate);
    dataBound
        .exit()
        .remove();
    dataBound
        .enter()
        .append('g')
        .classed('point', true)
        .attr('transform', d => `translate(${horizScale(d.audienceScore)},${vertScale(d.tomatometerScore)})`)
        .append('circle')
        .attr('r', 3)
        .attr('fill', colors[3]);
    
}
