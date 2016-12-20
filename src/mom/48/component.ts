import * as d3 from 'd3';

export var mom48 = {
    name: 'mom48',
    component: {
        templateUrl: 'mom/48/template.html',
        controller: controller
    }
}

function controller() {
    let width = 960;
let height = 480;

let svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

let plotMargins = {
    top: 30,
    bottom: 30,
    left: 50,
    right: 30
};
let plotGroup = svg.append('g')
    .classed('plot', true)
    .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);

let plotWidth = width - plotMargins.left - plotMargins.right;
let plotHeight = height - plotMargins.top - plotMargins.bottom;


let xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, plotWidth])
let xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format('0.0f'));

let xAxisGroup = plotGroup.append('g')
    .classed('axis', true)
    .attr('transform', `translate(${0},${plotHeight})`)
    .call(xAxis);

let yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([plotHeight, 0]);
let yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.format('2.0%'));
let yAxisGroup = plotGroup.append('g')
    .classed('axis', true)
    .attr('transform', `translate(${0},${0})`)
    .call(yAxis);


let areaGeneratorBottom90 = d3.area<any>()
    .x(d => xScale(d.data.year))
    .y0((d, i) => {
        let y0 = isNaN(d[0]) ? yScale(0) : yScale(d[0]);
        return y0;
    })
    .y1((d, i) => {
        let y1: number = isNaN(d[1]) ? yScale(d[0]) : yScale(d[1]);
        return y1;
    });

d3.csv('mom/48/data/Inequality.csv', (d: any) => {
    let par = (dd: string) => { return dd ? parseFloat(dd.replace('%', '')) / 100 : null; };
    return {
        year: parseInt(d.Year),
        bottom90: par(d['Bottom 90%']),
        top10: par(d['Top 10%'])
    };
}, (error: any, data: Array<any>) => {
    if (error) {
        console.error(error);
    } else {
        data = data.filter(d => !!d.bottom90);


        let stackGenerator = d3.stack<any>()
            .keys(['top10', 'bottom90']);
        let stacked = stackGenerator(data);
        console.log(stacked);
        // console.log(data);
        xScale.domain(d3.extent(data, d => d.year));
        xAxisGroup.call(xAxis);
        var dataBound = plotGroup.selectAll('.series')
            .data(stacked);
        dataBound
            .exit()
            .remove();
        let enterSelection = dataBound
            .enter()
            .append('g')
            .attr('class', d => d.key)
            .classed('series', true);
        enterSelection.append('path')
            .attr('d', areaGeneratorBottom90);
        enterSelection.append('text')
            .attr('transform', (d,i)=>`translate(${plotWidth / 2},${yScale(1-d3.mean(data, dd=>dd[d.key]))})`)
            .text(d => d.key);
    }
});
}