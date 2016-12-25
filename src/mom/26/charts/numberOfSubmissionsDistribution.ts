import * as d3 from 'd3';
import { chartContainer } from './chartContainer';
import { title } from './title';
import { horizontalAxis } from './horizontalAxis';

var _width;
var _height;

var xScale;
var xAxis: any;
var xAxisGroup;
var yScale: any;
var yAxis: any;
var yAxisGroup: any;

var seriesGroup: any;

var plotWidth: number;
var plotHeight: number;

var colorScale: any;

export function numberOfSubmissionsDistribution(container: d3.Selection<any, any, any, any>, width: number, height: number) {
    _width = width;
    _height = height;

    var chartMargins = {
        top: 50,
        left: 50,
        right: 50,
        bottom: 50
    };
    var cc = chartContainer(container, width, height, chartMargins, 'chart');
    var chartGroup = cc.group();
    var chartWidth = cc.width();
    var chartHeight = cc.height();

    var plotMargin = {
        top: 40,
        left: 0,
        right: 0,
        bottom: 0
    };
    var plotContainer = chartContainer(chartGroup, chartWidth, chartHeight, plotMargin, 'plot');
    var plotGroup = plotContainer.group();
    plotWidth = plotContainer.width();
    plotHeight = plotContainer.height();

    initTitle(chartGroup, chartWidth, chartHeight)
    initxScale(plotGroup, plotWidth, plotHeight);
    inityScale(plotGroup, plotWidth, plotHeight);

    seriesGroup = plotGroup.append('g')
        .classed('series', true);
    colorScale = d3.scaleLinear<any, any>()
        .range(['#e5f5f9', '#2ca25f'])
        .interpolate(d3.interpolateHcl);
    return {
        update: update
    }

}

function initTitle(container: d3.Selection<any, any, any, any>, width: number, height: number) {
    var t = title(container, width, height);
    t.text('Submission frequency');
}

function initxScale(container: d3.Selection<any, any, any, any>, width: number, height: number) {
    xAxis = horizontalAxis(container, width, height, 'bottom');
}

function inityScale(container: d3.Selection<any, any, any, any>, width: number, height: number) {
    // yAxis = charting.linearAxis(container, width, height, 'left');
    yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);
    yAxis = d3.axisLeft(yScale);
    yAxisGroup = container.append('g')
        .classed('axis', true)
        .call(yAxis);
}


function update(data: Array<any>) {
    var byPerson = d3.nest()
        .key((d: any) => d.name)
        .entries(data);
    var count = byPerson.map(d => d.values.length);
    var byCount = d3.nest()
        .key((d: any) => d)
        .entries(count);

    xAxis.domain([0, d3.max(byCount, d => +d.key)]);
    var xScale = xAxis.scale();

    yScale.domain([0, d3.max(byCount, d => d.values.length)]).nice();
    yAxisGroup.call(yAxis);

    colorScale.domain(d3.extent(byCount, d => d.values.length));
    var dataBound = seriesGroup.selectAll('.data')
        .data(byCount);
    dataBound
        .exit()
        .remove();
    var enterSelection = dataBound
        .enter()
        .append('g')
        .classed('data', true)
        .attr('transform', (d: any) => `translate(${xScale(+d.key)},${yScale(d.values.length)})`);
    enterSelection.append('rect')
        .attr('x', -10)
        .attr('y', 0)
        .attr('width', 20)
        .attr('height', (d:any) => plotHeight - yScale(d.values.length))
        .style('fill', (d:any) => colorScale(d.values.length));
}
