import * as d3 from 'd3';
let width = 800;
let height = 800;

let svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

let plotMargins = {
    top: 30,
    bottom: 30,
    left: 30,
    right: 30
};
let plotGroup = svg.append('g')
    .classed('plot', true)
    .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);
let colors = d3.schemeCategory10;
let plotWidth = width - plotMargins.left - plotMargins.right;
let plotHeight = height - plotMargins.top - plotMargins.bottom;

let chordGenerator = d3.chord()
    .padAngle(0.05);
let outerRadius = (plotWidth - plotMargins.left) / 2;
let arcGenerator = d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(outerRadius - 10);
let ribbonGenerator = d3.ribbon()
    .radius(outerRadius - 10);

let container = plotGroup.append('g')
    .attr('transform', `translate(${plotWidth / 2},${plotHeight / 2})`)

d3.csv('data/data.csv', (d: any) => {
    return {
        origin: d['Origin'],
        destination: d['Destination'],
        '1990': parseFloat(d['1990']),
        '1995': parseFloat(d['1995']),
        '2000': parseFloat(d['2000']),
        '2005': parseFloat(d['2005']),
    };
}, (error: any, data: Array<any>) => {
    if (error) {
        console.error(error);
    } else {
        // console.log(data);
        let byOriign = d3.nest<any>()
            .key(d => d.origin)
            .entries(data);
        let radius = 80;
        let globalRadius = (plotWidth - plotMargins.left) / 2 - radius;
        container.append('circle')
            .attr('r', globalRadius)
            .style('fill', 'none')
            .style('stroke', 'steelblue');
        // 10=>2PI
        let enterSelection = container.selectAll('g.origin')
            .data(byOriign)
            .enter()
            .append('g')
            .classed('origin', true)
              .attr('transform', (d,i)=>`translate(${globalRadius*(Math.cos(i/byOriign.length*2*Math.PI))},${globalRadius*(Math.sin(i/byOriign.length*2*Math.PI))})`);
        enterSelection.append('circle')
            .attr('r', radius)
            .style('fill', 'none')
            .style('stroke', (d, i) => colors[i]);
        enterSelection.append('text')
        .style('text-anchor', 'middle')    
            .text(d => d.key);


    }
});