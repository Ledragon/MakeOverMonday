import { select, Selection } from 'd3-selection';
import { axisLeft, axisBottom, Axis } from 'd3-axis';
import { scaleLinear, ScaleLinear, scaleOrdinal, scaleBand } from 'd3-scale';
import { pairs, sum, extent } from 'd3-array';
import { nest, Nest } from 'd3-collection';

import { color } from './colorScale';
import { dataFormat } from './dataFormat';

export class chart {
    private _chartMargins = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    };

    private _plotMargins = {
        top: 10,
        bottom: 25,
        left: 50,
        right: 10
    };

    private _group: Selection<any, any, any, any>;


    // private _yScale: ScaleBand<string>;
    // private _yAxis: Axis<any>;
    // private _yAxisGroup: Selection<any, any, any, any>;

    private _seriesGroup: Selection<any, any, any, any>;
    private _legendGroup: Selection<any, any, any, any>;

    private _width: number;
    private _height: number;

    constructor(container: Selection<any, any, any, any>, width: number, height: number) {
        this._group = container.append('g')
            .classed('chart', true)
            .attr('transform', `translate(${this._chartMargins.left},${this._chartMargins.top})`);
        this._width = width;
        this._height = height;
        // this._width = width;
        // this._height = height;
        // var chartGroup = container.append('g')
        //     .classed('chart-group', true)
        //     .attr('transform', `translate(${this._chartMargins.left},${this._chartMargins.top})`);

        // var chartWidth = this.width();
        // var chartHeight = this.height();


        // var plotGroup = chartGroup.append('g')
        //     .classed('plot-group', true)
        //     .attr('transform', `translate(${this._plotMargins.left},${this._plotMargins.top})`);

        // var plotWidth = chartWidth - this._plotMargins.left - this._plotMargins.right;// - this._legend.width();
        // var plotHeight = chartHeight - this._plotMargins.top - this._plotMargins.bottom;// - t.height();
    }

    private width(): number {
        return this._width - this._chartMargins.left - this._chartMargins.right;
    }
    private height(): number {

        return this._height - this._chartMargins.top - this._chartMargins.bottom;
    }

    update(data: Array<dataFormat>) {

        var byCategory = nest<dataFormat, string>()
            .key(d => d.category)
            .entries(data);
        let c = byCategory.map(d => d.key);
        let tmpScale = scaleBand<string>()
            .domain(c)
            .range([0, c.length]);
        let h = this.height() / byCategory.length;
        let w = 20;
        let that = this;

        let yScale = scaleLinear()
            .domain(extent(data, d => d.change))
            .range([this.height(), 0]);

        var dataBound = this._group.selectAll('.pane')
            .data(byCategory);
        dataBound
            .exit()
            .remove();
        var enterSelection = dataBound
            .enter()
            .append('g')
            .classed('pane', true)
            .attr('transform', (d, i) => `translate(${sum(byCategory.filter((dd, j) => j < i), d => d.values.length) * w},${0})`);
        enterSelection.append('rect')
            .classed('background-rect', true)
            .attr('width', d => d.values.length * w)
            .attr('height', this.height())
            .style('fill', (d, i) => {
                return color(tmpScale(d.key));
            });
        enterSelection
            .selectAll('rect')
            .data(d => d.values)
            .enter()
            .append('rect')
            .attr('x', (d, i) => i * w)
            .attr('width', 15)
            .attr('height', (d: dataFormat) => yScale(d.change));

        // .each(function (d) {
        //     let p = new pane(select(this), that.width(), h);
        //     p.update(d.values);
        // });
    }
}