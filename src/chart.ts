import {select, selectAll, Selection} from 'd3-selection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import {nest, Nest } from 'd3-collection';
import { xAxis } from './xAxis';
import { yAxis } from './yAxis';
import { dataFormat } from './models/dataFormat'

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

    private _xAxis: xAxis;
    private _yAxis: yAxis;

    private _seriesGroup: Selection;

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
        this.inityAxis(plotGroup, plotWidth, plotHeight);

        this._seriesGroup = plotGroup.append('g')
            .classed('series-group', true);
    }

    private initxAxis(container: Selection, width: number, height: number) {
        this._xAxis = new xAxis(container, width, height);
    }

    private inityAxis(container: Selection, width: number, height: number) {
        this._yAxis = new yAxis(container, width, height);
    }

    update(data: Array<dataFormat>) {
        this._xAxis.update(data);
        this._yAxis.update(data);
        var byTopic = nest<dataFormat>()
            .key(d => d.Topic)
            .entries(data);
        

        var dataBound = this._seriesGroup.selectAll('.series')
            .data(byTopic);
        dataBound
            .exit()
            .remove();
        dataBound
            .enter()
            .append('g')
            .classed('series', true)
            .attr('transform', d => `translate(${this._xAxis.scale()(d.key)},${0})`);
    }
}