import * as d3 from 'd3';
let width = 960;
let height = 480;
let green = '#84B082';
let red = '#885A5A';
let tmp = ["Bus On-Time Performance", "Bus Fleet Reliability",
    "Rail Fleet Reliability", "Rail On-Time Performance", "Escalator Reliability",
    "Elevator Reliability", "Customer Injury Rate (per 1M passengers)",
    "Employee Injury Rate (per 200K hours)", "Crimes (per 1M passengers)"];
    let type=["above", "above", "above", "above", "above", "above", "below", "below", "below"]
let svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

let plotMargins = {
    top: 30,
    bottom: 30,
    left: 60,
    right: 30
};
let plotGroup = svg.append('g')
    .classed('plot', true)
    .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);

let plotWidth = width - plotMargins.left - plotMargins.right;
let plotHeight = height - plotMargins.top - plotMargins.bottom;

let yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([plotHeight, 0]);
let yAxis = d3.axisLeft(yScale)
let yAxisGroup = plotGroup.append('g')
    .classed('axis', true)
    .call(yAxis);

const dateFormat = '%Y-%b';
let xScale = d3.scaleTime()
    .range([0, plotWidth])
let xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat('%b %y'));
let xAxisGroup = plotGroup.append('g')
    .classed('axis', true)
    .attr('transform', `translate(${0},${plotHeight})`)
    .call(xAxis);
let rectGorup = plotGroup.append('g')
    .classed('rects', true);
// plotGroup.append('g')
//     .classed('series', true)
//     .append('path');
plotGroup.append('g')
    .classed('target', true)
    .append('path');
let lineGenerator = d3.line<any>()
    .x(d => xScale(d.date));
let targetGenerator = d3.line<any>()
    .x(d => xScale(d.date));



d3.csv('data/data.csv', (error: any, data: IDataFormat) => {
    if (error) {
        console.error(error);
    } else {
        // console.log(data);
        let categories = data.columns.splice(2, 20).filter(d => d.indexOf('Target') < 0);
        console.log(JSON.stringify(categories));
        let filtered = data
            .filter(d => d.Month.indexOf('YTD') < 0)
            .map(d => {
                let obj = {
                    year: d['Year'].replace('CY ', ''),
                    month: d.Month
                }
                let date = d3.timeParse(dateFormat)(obj.year + '-' + obj.month);
                let res: any = {
                    date: date
                };
                for (var key in d) {
                    if (key !== 'Year' && key !== 'Month') {
                        res[key] = parseFloat(d[key])
                    };
                }
                return res;
            })
            .sort((a, b) => a.date - b.date);
        let dates = filtered.map(d => d.date);
        // console.log(dates);
        xScale.domain(d3.extent(dates));
        xAxisGroup.call(xAxis);
        d3.select('#menu')
            .selectAll('.menu-item')
            .data(categories)
            .enter()
            .append('div')
            .classed('menu-item', true)
            .on('click', function (d) {
                d3.selectAll('.menu-item')
                    .classed('highlight', false);
                d3.select(this)
                    .classed('highlight', true);
                updateLines(filtered, d);
            })
            .text(d => d)
    }
});

function updateLines(data: Array<any>, propertyName: string) {
    let targetName = `${propertyName} Target`;
    let diffs = data.map(d => {
        return {
            date: d.date,
            diff: d[propertyName] - d[targetName],
            target: d[targetName],
            value: d[propertyName]
        }
    });
    // let above = data.filter(d => d[propertyName] >= d[targetName]);
    // let below = data.filter(d => d[propertyName] <= d[targetName]);
    yScale.domain(d3.extent(data, d => d[propertyName])).nice();
    yAxisGroup.call(yAxis);
    lineGenerator.y(d => yScale(d[propertyName]));
    targetGenerator.y(d => yScale(d[propertyName + ' Target']));
    // plotGroup.select('.series')
    //     .select('path')
    //     .attr('d', lineGenerator(data.filter(d => !!d[propertyName])))
    plotGroup.select('.target')
        .select('path')
        .attr('d', targetGenerator(data.filter(d => !!d[propertyName])));
    var dataBound = rectGorup.selectAll('rect')
        .data(diffs);
    dataBound
        .exit()
        .remove();
    dataBound
        .enter()
        .append('rect')
        .attr('class', type[tmp.indexOf(propertyName)])
        .classed('plus', d => d.diff >= 0)
        .classed('minus', d => d.diff < 0)
        .attr('transform', d => `translate(${0},${d.diff > 0 ? yScale(d.value) - yScale(d.target) : 0})`)
        .attr('x', d => xScale(d.date))
        .attr('y', d => yScale(d.target))
        .attr('width', 20)
        .attr('height', d => Math.abs(yScale(d.value) - yScale(d.target)));
    dataBound
        .attr('class', type[tmp.indexOf(propertyName)])
        .classed('plus', d => d.diff >= 0)
        .classed('minus', d => d.diff < 0)
        .attr('transform', d => `translate(${0},${d.diff > 0 ? yScale(d.value) - yScale(d.target) : 0})`)
        .attr('x', d => xScale(d.date))
        .attr('y', d => yScale(d.target))
        .attr('width', 20)
        .attr('height', d => Math.abs(yScale(d.value) - yScale(d.target)));
    // areaPlusGenerator
    //     .y0(d => yScale(d[propertyName + ' Target']))
    //     .y1(d => d[propertyName] >= d[propertyName + ' Target'] ? yScale(d[propertyName]) : yScale(d[propertyName + ' Target']));
    // plotGroup.select('.area-plus')
    //     .select('path')
    //     .attr('d', areaPlusGenerator(data.filter(d => !!d[propertyName])));
}


interface IDataFormat extends Array<any> {
    columns: string[];
}

export var toto = '';