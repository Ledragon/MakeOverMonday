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
        top: 50,
        bottom: 20,
        left: 50,
        right: 20
    };

    private _xAxis: xAxis;
    private _yAxis: yAxis;

    private _seriesGroup: Selection;
    private _plotHeight: number;

    constructor(container: Selection, private _width: number, private _height: number) {
        var chartGroup = container.append('g')
            .classed('chart-group', true)
            .attr('transform', `translate(${this._chartMargins.left},${this._chartMargins.top})`);

        var chartWidth = this._width - this._chartMargins.left - this._chartMargins.right;
        var chartHeight = this._height - this._chartMargins.top - this._chartMargins.bottom;

        chartGroup.append('text')
            .classed('title', true)
              .attr('transform', `translate(${chartWidth/2},${0})`)
            .text('What they said');        

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
        this.initLegend(chartGroup, chartWidth, chartHeight);
    }

    private initxAxis(container: Selection, width: number, height: number) {
        this._xAxis = new xAxis(container, width, height);
    }

    private inityAxis(container: Selection, width: number, height: number) {
        this._yAxis = new yAxis(container, width, height);
    }

    private initLegend(container: Selection, width: number, height: number) {
        var legendWidth = 150;
        var legendHeight = 55;
        var group = container.append('g')
            .classed('legend', true)
            .attr('transform', `translate(${width - legendWidth},${(height - legendHeight) / 2})`);
        group.append('rect')
            .attr('height', legendHeight)
            .attr('width', legendWidth)
            .style('fill', 'none')
            .style('stroke', 'darkgray');
        var toto = [
            {
                text: 'Democrat',
                color: '#053C5E'
            },
            {
                text: 'Republican',
                color: '#A31621'
            }
        ]
        var dataBound = group.selectAll('.item')
            .data(toto);
        dataBound
            .exit()
            .remove();
        var enterSelection = dataBound
            .enter()
            .append('g')
            .classed('item', true)
            .attr('transform', (d, i) => `translate(${10},${i * 25 + 10})`);
        enterSelection.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', d => d.color);
        enterSelection.append('text')
            .attr('x', 15)
            .attr('y', 10)
            .text(d => d.text);

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
        var enterSelection = dataBound
            .enter()
            .append('g')
            .classed('series', true)
            .attr('transform', d => `translate(${this._xAxis.scale()(d.key)},${0})`);
        enterSelection
            .selectAll('rect')
            .data(d => d.values)
            .enter()
            .append('rect')
            .attr('width', this._xAxis.scale().bandwidth() / 2)
            .attr('height', d => this._plotHeight - this._yAxis.scale()(+d.Mentions))
            .attr('x', (d, i) => i * this._xAxis.scale().bandwidth() / 2)
            .attr('y', d => this._yAxis.scale()(+d.Mentions))
            .style('fill', d => d.Party === 'Democrat' ? '#053C5E' : '#A31621');
    }
}