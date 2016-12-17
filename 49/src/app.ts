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
        // console.log(byOriign);
        let matrix = byOriign.map(d => d.values.map(dd => dd['2005']));
        // console.log(matrix);
        let chords = chordGenerator(matrix);
        let g = container.datum(chords);
        let group = g.append('g')
            .classed('groups', true)
            .selectAll('g')
            .data(d => d.groups)
            .enter()
            .append('g');

        group.append('path')
            .attr('d', arcGenerator)
            .style('fill', (d, i) => colors[i])

        g.append("g")
            .attr("class", "ribbons")
            .selectAll("path")
            .data(function (chords) { return chords; })
            .enter().append("path")
            .attr("d", ribbonGenerator)
            .style("fill", (d) => { return colors[d.target.index]; })
        // .style("stroke", function(d) { return d3.rgb(color(d.target.index)).darker(); });
        // var dataBound = container.selectAll('.chord')
        //     .data(chords);
        // dataBound
        //   .exit()
        //   .remove();
        // let enterSelection = dataBound
        //   .enter()
        //   .append('g')
        //     .classed('chord', true);
        // enterSelection.append('path')
        // .attr('d', arcGenerator)

    }
});