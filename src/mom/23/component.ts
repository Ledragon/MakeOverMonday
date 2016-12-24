import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

export var mom23 = {
    name: 'mom23',
    component: {
        templateUrl: 'mom/23/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    var width = 800;
    var height = 600;
    var marginBottom = 50;
    const marginTop = 20;
    const marginLeft = 50;
    const marginRight = 50;
    var plotMargin = {
        top: 50,
        left: 0,
        right: 0,
        bottom: 0
    };
    'use strict';
    var chartGroup = d3.select('#chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${marginLeft},${marginTop})`);
    var chartWidth = width - marginLeft - marginRight;
    var chartHeight = height - marginTop - marginBottom;
    var plotGroup = chartGroup
        .append('g')
        .attr('transform', `translate(${plotMargin.left},${plotMargin.top})`);
    var plotWidth = chartWidth - plotMargin.left - plotMargin.right;
    var plotHeight = chartHeight - plotMargin.top - plotMargin.bottom;


    chartGroup.append('g')
        .classed('title', true)
        .style('text-anchor', 'middle')
        .attr('transform', `translate(${width / 2},${10})`)
        .append('text')
        .text('Facebook energy consumption');


    const fileName = 'mom/23/data/Facebook Energy Sources.csv';
    csvService.read<any>(fileName, update, parseFunction);

    function update(data: Array<any>) {
        console.log(data);
        var test = d3.nest<any>()
            .key((d) => d.year)
            .entries(data.sort((a,b)=>a.year-b.year));

        var x0 = d3.scaleBand()
            .domain(test.map(d => d.key))
            .rangeRound([0, plotWidth])
            .padding(0.1);

        var xAxis = d3.axisBottom(x0);
        var xAxisGroup = plotGroup
            .append('g')
            .attr('transform', `translate(0,${plotHeight})`);
        xAxisGroup.call(xAxis);
        var sources = d3.nest<any>()
            .key((d) => d.energySource)
            .entries(data);
        var sourceNames = sources.map(d => d.key);
        var x1 = d3.scaleBand()
            .domain(sourceNames)
            .rangeRound([0, x0.bandwidth()]);

        var yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([plotHeight, 0])

        var yAxis = d3.axisLeft(yScale)
            .tickFormat(d3.format('2.0%'));
        var yAxisGroup = plotGroup.append('g')
            .classed('axis', true)
            .call(yAxis);

        var c10 = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(sourceNames);
        var seriesGroup = plotGroup.append('g')
            .classed('chart-group', true);
        var enterSelection = seriesGroup.selectAll('.series')
            .data(test)
            .enter()
            .append('g')
            .classed('series', true)
            .attr('transform', d => `translate(${x0(d.key)},${0})`);
        enterSelection.selectAll('rect')
            .data(d => <Array<any>>d.values)
            .enter()
            .append('rect')
            .attr('x', d => x1(d.energySource))
            .attr('y', d => yScale(d.amount))
            .attr('height', d => plotHeight - yScale(d.amount))
            .attr('width', x1.bandwidth())
            .style('fill', d => c10(d.energySource));

        var legend = plotGroup.append('g')
            .classed('legend', true)
            .attr('transform', (d, i) => `translate(${width - 200 - marginRight},${0})`);
        legend.append('rect')
            .attr('height', 110)
            .style('fill', 'rgb(250,250,250)')
        var les = legend.selectAll('.item')
            .data(sourceNames)
            .enter()
            .append('g')
            .classed('item', true)
            .attr('transform', (d, i) => `translate(${10},${i * 20 + 10})`);
        les.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', d => c10(d));
        les.append('text')
            .attr('transform', (d, i) => `translate(${15},${10})`)
            .text(d => d)
    };
}

function parseFunction(d: any) {
    return {
        year: +d.Year,
        energySource: d['Energy Source'],
        amount: +(d.Amount.replace('%', '')) / 100
    }
}

