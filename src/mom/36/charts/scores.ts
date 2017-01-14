import * as d3 from 'd3';

import { title } from '../../../charting/title';
import { LeftCategoricalAxis } from '../../../charting/LeftCategoricalAxis';
import { IMargins } from '../../../charting/IMargins';

import { IDate } from './IDate';
import { group } from './group';
import { colors } from './colors';

var _marginTop = 50;

export function scores(selection: d3.Selection<any, any, any, any>, width: number, height: number, data: Array<any>) {
    var byDate = data.sort((a, b) => d3.descending(a.audienceScore, b.audienceScore));

    var chartMargins: IMargins = { top: 10, bottom: 10, left: 10, right: 10 };
    var chart = new group(selection, width, height, chartMargins, 'chart-group');
    var expectedWidth = 400;
    let marginLeft = 250;
    var plotMargins: IMargins = { top: _marginTop, bottom: 0, left: marginLeft, right: 0 };
    var plot = new group(chart.group(), chart.width(), chart.height(), plotMargins, 'plot-group');

    let plotGroup = plot.group();
    let plotWidth = plot.width();
    let plotHeight = plot.height();
    let yAxis = new LeftCategoricalAxis(plotGroup, plotWidth, plotHeight)
        .padding(0.25)
        .domain(byDate.map(d => d.title));

    drawScores(plot.group(), plot.width(), plot.height(), yAxis, data);

    var fmt = d3.format('2.2f');

    let t = new title(chart.group(), chart.width(), chart.height());
    t.text(`Scores (tomato:${fmt(d3.mean(byDate, d => d.tomatometerScore))}, audience:${fmt(d3.mean(byDate, d => d.audienceScore))})`);
    t.classed('title');
}

function drawScores(selection: d3.Selection<any, any, any, any>, width: number, height: number, scale: LeftCategoricalAxis<any>, data: Array<any>) {
    var group = selection.append('g')
        .classed('series', true)
        .attr('transform', `translate(${0},${0})`);
    var dataBound = group.selectAll('.item')
        .data(data);
    dataBound
        .exit()
        .remove();
    var scoreScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);
    var enterSelection = dataBound
        .enter()
        .append('g')
        .classed('item', true)
        .attr('transform', d => `translate(${0},${scale.scale(d.title)})`);
    let bandHeight = scale.bandWidth() / 2;
    enterSelection.append('rect')
        .attr('y', bandHeight)
        .attr('width', d => scoreScale(d.tomatometerScore))
        .attr('height', bandHeight)
        .style('fill', colors[3]);
    enterSelection.append('rect')
        .attr('width', d => scoreScale(d.audienceScore))
        .attr('height', bandHeight)
        .style('fill', colors[0]);
}
