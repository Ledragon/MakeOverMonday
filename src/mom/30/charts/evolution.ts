import { Selection, selectAll } from 'd3-selection';
import { nest } from 'd3-collection';
import { extent } from 'd3-array';
import { line } from 'd3-shape';

import { xAxis } from './xAxis';
import { yAxis } from './yAxis';
import { title } from './title';
import { colorScale } from './colorScale';
import { dataFormat } from '../dataFormat';
import { IDataFormat } from '../../../models/IDataFormat';

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

    private _seriesGroup: Selection<any, any, any, any>;
    private _plotHeight: number;
    private _showGender: boolean;
    private _title: title;
    constructor(container: Selection<any, any, any, any>, private _width: number, private _height: number) {
        var chartGroup = container.append('g')
            .classed('chart-group', true)
            .attr('transform', `translate(${this._chartMargins.left},${this._chartMargins.top})`);

        var chartWidth = this._width - this._chartMargins.left - this._chartMargins.right;
        var chartHeight = this._height - this._chartMargins.top - this._chartMargins.bottom;

        let titleGroup = chartGroup.append('g')
            .classed('title-sm', true)
            .attr('transform', `translate(${0},${20})`);

        this._title = new title(titleGroup, chartWidth, chartHeight);

        var plotGroup = chartGroup.append('g')
            .classed('plot-group', true)
            .attr('transform', `translate(${this._plotMargins.left},${this._plotMargins.top})`);

        var plotWidth = chartWidth - this._plotMargins.left - this._plotMargins.right;
        var plotHeight = chartHeight - this._plotMargins.top - this._plotMargins.bottom;
        this._plotHeight = plotHeight;
        this.initxAxis(plotGroup, plotWidth, plotHeight);
        this.inityAxis(plotGroup, plotWidth, plotHeight);
        this._showGender = false;
        this.initSeries(plotGroup, plotWidth, plotHeight);
    }

    private initxAxis(container: Selection<any, any, any, any>, width: number, height: number) {
        this._xAxis = new xAxis(container, width, height);
    }

    private inityAxis(container: Selection<any, any, any, any>, width: number, height: number) {
        this._yAxis = new yAxis(container, width, height);
    }

    private initSeries(container: Selection<any, any, any, any>, width: number, height: number) {
        var cs = new colorScale();
        this._seriesGroup = container.append('g')
            .classed('series-group', true);
        this._seriesGroup
            .append('path')
            .classed('line-data total', true)
            .style('stroke', cs.color(1))
        this._seriesGroup
            .append('path')
            .classed('line-data male', true)
        //         .attr('d', lineGenerator(data));
        //     lineGenerator
        //         .y(d => yScale(d.female));
        this._seriesGroup
            .append('path')
            .classed('line-data female', true)
        //         .attr('d', lineGenerator(data));
    }

    showGender(value?: boolean): boolean | evolution {
        if (arguments.length > 0) {
            this._showGender = value;
            return this;
        } else {
            return this._showGender;
        }
    }

    titleText(value: string): void {
        this._title.text(value);
    }

    update(data: IDataFormat<dataFormat>) {
        this._xAxis.update(data);
        this._yAxis.update(data);
        var xScale = this._xAxis.scale();
        var yScale = this._yAxis.scale();
        var lineGenerator = line<dataFormat>()
            .x(d => xScale(d.year))
            .y(d => yScale(d.total));
        this._seriesGroup
            .select('path.total')
            .attr('d', lineGenerator(data));
        if (this._showGender) {
            lineGenerator
                .y(d => yScale(d.male));
            this._seriesGroup
                .select('path.male')
                .style('visibility', 'visible')
                .attr('d', lineGenerator(data));
            lineGenerator
                .y(d => yScale(d.female));
            this._seriesGroup
                .select('path.female')
                .style('visibility', 'visible')
                .attr('d', lineGenerator(data));
        } else {
            this._seriesGroup
                .select('path.male')
                .style('visibility', 'hidden')
            this._seriesGroup
                .select('path.female')
                .style('visibility', 'hidden')
        }
    }
}