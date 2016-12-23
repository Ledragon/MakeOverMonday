import * as d3 from 'd3';
import { IDate } from './Idate';
import { IMargins } from './IMargins';
import { group } from './group';

export function movies(selection: d3.Selection<any, any, any, any>, width: number, height: number, data: Array<any>) {
    var byDate = data.sort((a, b) => d3.ascending(a.date, b.date));

    // var chartMargins: IMargins = { top: 10, bottom: 10, left: 10, right: 10 };
    // var chart = new group(selection, width, height, chartMargins, 'chart-group');
    // var plotMargins: IMargins = { top: 0, bottom: 0, left: 0, right: 0 };
    // var plot = new group(chart.group(), chart.width(), chart.height(), plotMargins, 'plot-group');

    // var timeScale = d3.scaleTime()
    //     .domain(d3.extent(byDate, d => d.date))
    //     .range([0, plot.height()]);


    // var timeAxis = d3.axisLeft(timeScale);
    // var timeAxisGroup = plot.group()
    //     .append('g')
    //     .classed('time-axis', true)
    //     .call(timeAxis);
    // var color = 'rgba(241, 232, 184, 1)';
    // timeAxisGroup.select('path.domain')
    //     .attr('stroke', color)
    // var ticks = timeAxisGroup.selectAll('.tick');
    // ticks.select('line')
    //     .attr('stroke', color);
    // ticks.select('text')
    //     .attr('fill', color)
}