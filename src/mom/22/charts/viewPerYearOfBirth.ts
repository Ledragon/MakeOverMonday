import * as d3 from 'd3';

import { title } from '../../../charting/title';
import { plot } from '../../../charting/plotFactory';
import { BottomLinearAxis } from '../../../charting/BottomLinearAxis';
import { LeftLinearAxis } from '../../../charting/LeftLinearAxis';

import { IHistory } from '../IHistory';

export class viewPerYearOfBirth {
    private _marginTop = 60;
    private _marginBottom = 30;
    private _marginLeft = 60;
    private _marginRight = 30;
    private _container: d3.Selection<any, any, any, any>;

    private _xAxis: BottomLinearAxis<any>;
    private _yAxis: LeftLinearAxis<any>;

    private _pathGenerator: d3.Line<any>;
    private _pathGroup: d3.Selection<any, any, any, any>;

    private _preparedData: any;

    constructor(containerId: string, private _width: number, private _height: number) {
        var p = plot('#' + containerId, this._width, this._height, { top: this._marginTop, bottom: this._marginBottom, left: this._marginLeft, right: this._marginRight });
        this._container = p.group();
        var container = this._container.append('g')
            .classed('chart-container', true);
        let plotWidth = p.width();
        let plotHeight = p.height();
        this._xAxis = new BottomLinearAxis(container, plotWidth, plotHeight);
        this._yAxis = new LeftLinearAxis(<any>container, plotWidth, plotHeight)
            .format('s');
        this.initPathGenerator(container);
        new title(p.parent(), this._width, this._height)
            .text('Total number of views according to birth year');
    }

    private initPathGenerator(container: d3.Selection<any, any, any, any>) {
        this._pathGenerator = d3.line<any>()
            .x(d => this._xAxis.scale(d.Birthyear))
            .y(d => this._yAxis.scale(+(d['Total Page Views'].replace(/,/g, ''))))
        this._pathGroup = container.append('g')
            .append('path')
            .style('fill', 'transparent')
            .style('stroke', '#C2E7D9')
            .style('stroke-width', '1px')
    }

    update(data: Array<any>): void {
        var years = data.map(d => +d.Birthyear)
            .sort((a, b) => a - b);
        var mapped = data.map(d => +(d['Total Page Views'].replace(/,/g, '')));
        this._xAxis.domain(d3.extent(years));
        this._yAxis.domain(d3.extent(mapped));

        var prepared = data.filter(d => !!d.Birthyear)
            .sort((a, b) => a.Birthyear - b.Birthyear);
        this._pathGroup
            .attr('d', this._pathGenerator(prepared));
        this._preparedData = prepared;
    }

}
