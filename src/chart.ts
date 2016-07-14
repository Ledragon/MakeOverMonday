import {select, selectAll, Selection} from 'd3-selection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';

export class chart {
    private _chartMargins = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    };

    private _plotMargins = {
        top: 0,
        bottom: 20,
        left: 50,
        right: 20
    };

    constructor(container: Selection, private _width: number, private _height: number) {
        var chartGroup = container.append('g')
            .classed('chart-group', true)
            .attr('transform', `translate(${this._chartMargins.left},${this._chartMargins.top})`);

        var chartWidth = this._width - this._chartMargins.left - this._chartMargins.right;
        var chartHeight = this._height - this._chartMargins.top - this._chartMargins.bottom;

        var plotGroup = chartGroup.append('g')
            .classed('plot-group', true)
            .attr('transform', `translate(${this._plotMargins.left},${this._plotMargins.top})`);

        var plotWidth = chartWidth - this._plotMargins.left - this._plotMargins.right;
        var plotHeight = chartHeight - this._plotMargins.top - this._plotMargins.bottom;

        this.initxAxis(plotGroup, plotWidth, plotHeight);
    }

    private initxAxis(container: Selection, width: number, height: number) {
        var xScale = scaleTime()
            .domain([new Date(2016, 7, 1), new Date(2016, 7, 2)])
            .range([0, width]);
        var xAxis = axisBottom(xScale);
        var xAxisGroup = container.append('g')
            .classed('horizontal axis', true)
            .attr('transform', `translate(${0},${height})`)
            .call(xAxis);
    }
}