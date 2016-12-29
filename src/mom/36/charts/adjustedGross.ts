import * as d3 from 'd3';

import { title } from '../../../charting/title';
import { LeftCategoricalAxis } from '../../../charting/LeftCategorical';
import { IMargins } from '../../../charting/IMargins';

import { IDate } from './Idate';
import { group } from './group';
import { colors } from './colors';

var _marginTop = 50;

export function chart(selection: d3.Selection<any, any, any, any>, width: number, height: number, data: Array<any>) {
    var byDate = data.sort((a, b) => d3.descending(a.adjustedGross, b.adjustedGross));

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
    
    drawProfits(plot.group(), plot.width(), plot.height(), yAxis, data);

    var fmt = d3.format('$3.4s');    
    let t = new title(chart.group(), chart.width(), chart.height());
    t.text(`Adjusted gross (total: ${fmt(d3.sum(byDate, d => d.adjustedGross))})`);
    t.classed('title');
}

function drawProfits(selection: d3.Selection<any, any, any, any>, width: number, height: number, axis: LeftCategoricalAxis<any>, data: Array<any>) {
    var group = selection.append('g')
        .classed('series', true)
        .attr('transform', `translate(${0},${0})`);
    var dataBound = group.selectAll('.item')
        .data(data);
    dataBound
        .exit()
        .remove();
    var scoreScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.adjustedGross)])
        .range([0, width]);
    var enterSelection = dataBound
        .enter()
        .append('g')
        .classed('item', true)
        .attr('transform', d => `translate(${0},${axis.scale(d.title)})`);
    enterSelection.append('rect')
        .attr('width', d => scoreScale(d.adjustedGross))
        .attr('height', axis.bandWidth())
        .style('fill', colors[3]);
}