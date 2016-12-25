import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

export var mom31 = {
    name: 'mom31',
    component: {
        templateUrl: 'mom/31/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    const _width = 1000;
    const _height = 400;
    const _chartMargins = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    };

    const _plotMargins = {
        top: 20,
        bottom: 20,
        left: 150,
        right: 20
    };
    var svg = d3.select('#chart')
        .append('svg')
        .attr('width', _width)
        .attr('height', _height);

    var chartGroup = svg.append('g')
        .classed('chart-group', true)
        .attr('transform', `translate(${_chartMargins.left},${_chartMargins.top})`);

    var chartWidth = _width - _chartMargins.left - _chartMargins.right;
    var chartHeight = _height - _chartMargins.top - _chartMargins.bottom;

    var plotGroup = chartGroup.append('g')
        .classed('plot-group', true)
        .attr('transform', `translate(${_plotMargins.left},${_plotMargins.top})`);

    var plotWidth = chartWidth - _plotMargins.left - _plotMargins.right;
    var plotHeight = chartHeight - _plotMargins.top - _plotMargins.bottom;

    let xScale = d3.scaleBand<string>()
        .range([0, plotWidth]);
    let xAxis = d3.axisBottom(xScale);
    let xAxisGroup = plotGroup.append('g')
        .attr('transform', `translate(${0},${plotHeight})`);

    let yScale = d3.scaleBand<string>()
        .range([0, plotHeight]);
    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = plotGroup.append('g');

    let seriesScale = d3.scaleLinear<number>()
        .range([0, 15]);
    let seriesGroup = plotGroup.append('g');


    const fileName = 'mom/31/data/Not Saying Groin.csv';
    csvService.read<any>(fileName, update);

    function update(data: IDataFormat<any>) {
        var labels = data.columns.filter(d => d !== 'Phrase' && d !== 'Total');

        var phrases = data.map(d => d['Phrase']);
        let byPhrase = d3.nest<any>()
            .key(d => d['Phrase'])
            .entries(data)
            .map(d => {
                let tmp = d.values;
                let result = [];
                for (var key in tmp[0]) {
                    result.push({
                        key: key,
                        value: +tmp[0][key]
                    })
                }
                return {
                    key: d.key,
                    values: result.filter(d => labels.indexOf(d.key) >= 0)
                }
            });
        var values = [].concat.apply([], byPhrase.map(d => d.values)).map((d: any) => d.value);
        seriesScale.domain(d3.extent(values));
        console.log(values);
        xScale.domain(labels);
        xAxisGroup.call(xAxis);
        yScale.domain(phrases);
        yAxisGroup.call(yAxis);
        var dataBound = seriesGroup.selectAll('.seriesGroup')
            .data(byPhrase);
        dataBound
            .exit()
            .remove();
        let enterSelection = dataBound
            .enter()
            .append('g')
            .classed('seriesGroup', true)
            .attr('transform', (d, i) => {
                return `translate(${0},${yScale(d.key) + yScale.bandwidth() / 2})`
            });
        enterSelection.append('line')
            .classed('gridline', true)
            .attr('x1', 0)
            .attr('x2', plotWidth)
        // .attr('y1', yScale.bandwidth() / 2)
        // .attr('y2', yScale.bandwidth() / 2)
        enterSelection
            .selectAll('g')
            .data(d => d.values)
            .enter()
            .append('circle')
            .style('fill', '#824670')
            .attr('cx', d => xScale(d.key) + xScale.bandwidth() / 2)
            // .attr('cy', yScale.bandwidth() / 2)
            .attr('r', d => seriesScale(d.value))
    };
}

interface IDataFormat<T> extends Array<T> {
    columns: Array<string>;
}