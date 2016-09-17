import * as d3 from '../../d3';
import { IDate } from './Idate';
import { IMargins } from './IMargins';
import { group } from './group';
import { colors } from './colors';

export function scores(selection: d3.Selection<any, any, any, any>, width: number, height: number, data: Array<any>) {
    var byDate = data.sort((a, b) => d3.ascending(a.title, b.title));

    var chartMargins: IMargins = { top: 10, bottom: 10, left: 10, right: 10 };
    var chart = new group(selection, width, height, chartMargins, 'chart-group');
    var plotMargins: IMargins = { top: 50, bottom: 0, left: 250, right: 800 };
    var plot = new group(chart.group(), chart.width(), chart.height(), plotMargins, 'plot-group');

    var moviesScale = d3.scaleBand<any>()
        .domain(byDate.map(d => d.title))
        .range([0, plot.height()]);

    var movieAxis = d3.axisLeft(moviesScale);
    var movieAxisGroup = plot.group()
        .append('g')
        .classed('time-axis', true)
        .call(movieAxis);
    var color = 'rgba(241, 232, 184, 1)';
    movieAxisGroup.select('path.domain')
        .attr('stroke', color)
    var ticks = movieAxisGroup.selectAll('.tick');
    ticks.select('line')
        .attr('stroke', color);
    ticks.select('text')
        .attr('fill', color);

    drawScores(plot.group(), plot.width(), plot.height(), moviesScale, data);

    chart.group()
        .append('g')
        .classed('title', true)
        .attr('transform', `translate(${plotMargins.left + plot.width() / 2},${30})`)
        .append('text')
        .text('Scores')
        .attr('fill', color)


    var plot2Margins: IMargins = { top: 50, bottom: 0, left: 850, right: 300 };
    var plot2 = new group(chart.group(), chart.width(), chart.height(), plot2Margins, 'plot-group');
    draw(plot2, moviesScale, data, 'Adjusted gross', d => d.adjustedGross)
    // drawProfits(plot2.group(), plot2.width(), plot2.height(), moviesScale, data);
}

function draw(group: group, scale: d3.ScaleBand<string>, data: Array<any>, title: string, selector: (d: any) => number) {
    var selection = group.group();
    var width = group.width();
    var height = group.height();
    // var g = selection.append('g')
    //     .classed('series', true)
    //     .attr('transform', `translate(${0},${0})`);
    // g.append('g')
    //     .classed('title', true)
    //     .attr('transform', `translate(${width / 2},${0})`)
    //     .append('text')
    //     .text(title)
    //     .attr('fill', colors[0])
    var dataBound = selection.selectAll('.item')
        .data(data);
    dataBound
        .exit()
        .remove();
    var scoreScale = d3.scaleLinear()
        .domain([0, d3.max(data, selector)])
        .range([0, width]);
    var enterSelection = dataBound
        .enter()
        .append('g')
        .classed('item', true)
        .attr('transform', d => `translate(${0},${scale(d.title)})`);
    enterSelection.append('rect')
        .attr('width', d => scoreScale(selector(d)))
        .attr('height', scale.bandwidth())
        .style('fill', colors[3]);
    // enterSelection.append('rect')
    //     .attr('x', d => -scoreScale(d.audienceScore))
    //     .attr('width', d => scoreScale(d.audienceScore))
    //     .attr('height', scale.bandwidth())
    //     .style('fill', colors[0]);
}

function drawScores(selection: d3.Selection<any, any, any, any>, width: number, height: number, scale: d3.ScaleBand<string>, data: Array<any>) {
    var group = selection.append('g')
        .classed('series', true)
        .attr('transform', `translate(${width / 2},${0})`);
    var dataBound = group.selectAll('.item')
        .data(data);
    dataBound
        .exit()
        .remove();
    var scoreScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width / 2]);
    var enterSelection = dataBound
        .enter()
        .append('g')
        .classed('item', true)
        .attr('transform', d => `translate(${0},${scale(d.title)})`);
    enterSelection.append('rect')
        .attr('width', d => scoreScale(d.tomatometerScore))
        .attr('height', scale.bandwidth())
        .style('fill', colors[3]);
    enterSelection.append('rect')
        .attr('x', d => -scoreScale(d.audienceScore))
        .attr('width', d => scoreScale(d.audienceScore))
        .attr('height', scale.bandwidth())
        .style('fill', colors[0]);
}

function drawProfits(selection: d3.Selection<any, any, any, any>, width: number, height: number, scale: d3.ScaleBand<string>, data: Array<any>) {
    var group = selection.append('g')
        .classed('series', true)
        .attr('transform', `translate(${width / 2},${0})`);
    var dataBound = group.selectAll('.item')
        .data(data);
    dataBound
        .exit()
        .remove();
    var scoreScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.lifetimeGross)])
        .range([0, width / 2]);
    var enterSelection = dataBound
        .enter()
        .append('g')
        .classed('item', true)
        .attr('transform', d => `translate(${0},${scale(d.title)})`);
    enterSelection.append('rect')
        .attr('width', d => scoreScale(d.adjustedGross))
        .attr('height', scale.bandwidth())
        .style('fill', colors[3]);
    enterSelection.append('rect')
        .attr('x', d => -scoreScale(d.lifetimeGross))
        .attr('width', d => scoreScale(d.lifetimeGross))
        .attr('height', scale.bandwidth())
        .style('fill', colors[0]);
}