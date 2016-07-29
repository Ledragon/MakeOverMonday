import { Selection, selectAll } from 'd3-selection';
import { nest } from 'd3-collection';
import { extent } from 'd3-array';
import { line } from 'd3-shape';

import { xAxis } from './xAxis';
import { yAxis } from './yAxis';
import { colorScale } from './colorScale';
import { dataFormat } from '../typings-custom/dataFormat';

export class evolution {
    private _chartMargins = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    };

    private _plotMargins = {
        top: 50,
        bottom: 20,
        left: 50,
        right: 20
    };

    private _xAxis: xAxis;
    private _yAxis: yAxis;

    private _seriesGroup: Selection;
    private _plotHeight: number;
    private _showGender: boolean;
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
        this._plotHeight = plotHeight;
        this.initxAxis(plotGroup, plotWidth, plotHeight);
        this.inityAxis(plotGroup, plotWidth, plotHeight);

        this._seriesGroup = plotGroup.append('g')
            .classed('series-group', true);
        this._showGender = false;
    }

    private initxAxis(container: Selection, width: number, height: number) {
        this._xAxis = new xAxis(container, width, height);
    }

    private inityAxis(container: Selection, width: number, height: number) {
        this._yAxis = new yAxis(container, width, height);
    }
    showGender(value?: boolean): boolean | evolution {
        if (arguments.length > 0) {
            this._showGender = value;
            return this;
        } else {
            return this._showGender;
        }
    }
    update(data: Array<dataFormat>) {
        this._xAxis.update(data);
        this._yAxis.update(data);
        var xScale = this._xAxis.scale();
        var yScale = this._yAxis.scale();
        var cs = new colorScale();
        var lineGenerator = line<dataFormat>()
            .x(d => xScale(d.year))
            .y(d => yScale(d.total));
        this._seriesGroup
            .append('path')
            .classed('line-data', true)
            .attr('d', lineGenerator(data))
            .style('stroke', cs.color(1));
        if (this._showGender) {
            lineGenerator
                .y(d => yScale(d.male));
            this._seriesGroup
                .append('path')
                .classed('line-data male', true)
                .attr('d', lineGenerator(data));
            lineGenerator
                .y(d => yScale(d.female));
            this._seriesGroup
                .append('path')
                .classed('line-data female', true)
                .attr('d', lineGenerator(data));
        }
    }
}