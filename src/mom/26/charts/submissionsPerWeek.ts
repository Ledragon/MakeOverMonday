import * as d3 from 'd3';
import { chartContainer } from './chartContainer';
import { horizontalAxis } from './horizontalAxis';
import { title } from './title';
var _width;
var _height;

var xScale;
let xAxis: any;
let xAxisGroup;
let yScale: any;
let yAxis: any;
let yAxisGroup: any;

var seriesGroup: d3.Selection<any, any, any, any>;
var dispatch: any = d3.dispatch('clicked');


export function submissionsPerWeek(container: d3.Selection<any, any, any, any>, width: number, height: number) {
    _width = width;
    _height = height;
    var chartMargins = {
        top: 50,
        left: 50,
        right: 50,
        bottom: 50
    };

    var cc = chartContainer(container, width, height, chartMargins,
        'chart');

    var chartGroup = cc.group();
    var chartWidth = cc.width();
    var chartHeight = cc.height();
    initPlot(chartGroup, chartWidth, chartHeight);
    initTitle(chartGroup, chartWidth, chartHeight);
    return {
        update: update,
        dispatch: dispatch
    }
};

function initTitle(container: d3.Selection<any, any, any, any>, width: number, height: number) {
    var t = title(container, width, height);
    t.text('Number of submissions per week');
}

function initPlot(container: d3.Selection<any, any, any, any>, width: number, height: number) {
    var plotMargin = {
        top: 40,
        left: 0,
        right: 0,
        bottom: 0
    };
    var plotContainer = chartContainer(container, width, height, plotMargin, 'plot');
    var plotGroup = plotContainer.group();
    var plotWidth = plotContainer.width();
    var plotHeight = plotContainer.height();

    initxScale(plotGroup, plotWidth, plotHeight);
    inityScale(plotGroup, plotWidth, plotHeight);

    seriesGroup = plotGroup.append('g')
        .classed('series', true);
}

function initxScale(container: d3.Selection<any, any, any, any>, width: number, height: number) {
    xAxis = horizontalAxis(container, width, height, 'bottom');
}

function inityScale(container: d3.Selection<any, any, any, any>, width: number, height: number) {
    yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);
    yAxis = d3.axisLeft(yScale);
    yAxisGroup = container.append('g')
        .classed('axis', true)
        .call(yAxis);
}

function update(data: Array<any>) {
    var byWeek = d3.nest<any>()
        .key(d => d.week)
        .entries(data);

    xAxis.domain([0, d3.max(byWeek, w => +w.key)]);
    var xScale = xAxis.scale();

    yScale.domain([0, d3.max(byWeek, w => +w.values.length)]);
    yAxisGroup.call(yAxis);

    var dataBound = seriesGroup
        .selectAll('.data')
        .data(byWeek);
    dataBound
        .exit()
        .remove();
    var enterSelection = dataBound
        .enter()
        .append('g')
        .classed('data', true)
        .attr('transform', d => `translate(${xScale(+d.key)},${yScale(d.values.length)})`);
    enterSelection.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 4)
        .style('fill', '#2ca25f')
        .on('click', d => {
            dataBound.select('circle')
                .style('fill', '#2ca25f')
                .style('stroke', 'none')
            d3.select(d3.event.currentTarget)
                .style('fill', '#e5f5f9')
                .style('stroke', '#2ca25f');
            dispatch.clicked(d);

        });
}