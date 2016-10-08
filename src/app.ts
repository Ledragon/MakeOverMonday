import { csv, json, request } from 'd3-request';
import { select } from 'd3-selection';
import { queue } from 'd3-queue';
import { nest } from 'd3-collection';
import { max, extent, range } from 'd3-array';
import { geoMercator, geoPath } from 'd3-geo';
import { scaleLinear } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';


let node = (select('.content').node() as any).getBoundingClientRect();
let width = 960//node.width;//- 20;
let height = 640//node.height;// - 10;
let chartSvg = select('.content')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

let legend = chartSvg.append('g')
    .classed('legend', true)
    .attr('transform', `translate(${30},${50})`)
legend.append('text')
    .style('font-size', '36px')
    .text(2000);

let scaleLegend = legend.append('g')
    .classed('scale', true)
    .attr('transform', `translate(${0},${10})`);
let rectWidth = 2;
scaleLegend.selectAll('rect')
    .data(range(0, 1, 0.01))
    .enter()
    .append('rect')
    .attr('x', (d, i) => i * rectWidth)
    .attr('height', 10)
    .attr('width', rectWidth)
    .style('fill', d => interpolateBlues(d));
legend.append('text')
    .text('Less peaceful')
    .attr('transform', `translate(${0},${30})`)
legend.append('text')
    .text('More peaceful')
    .style('text-anchor', 'end')
    .attr('transform', `translate(${200},${30})`)


let projection = geoMercator()
// .fitSize([width, height], world);
let pathGenerator = geoPath()
    .projection(projection);

drawMap();

function drawMap() {

    let colorScale = scaleLinear()
        .range([0, 1]);
    var q = queue()
        .defer(csv, 'data/Global Peace Index 2016.csv')
        .defer(json, 'data/countries.json')
        .await((error, csvData, world) => {
            if (error) {
                console.error(error);
            } else {
                let byYear = nest()
                    .key(d => d.Year)
                    .entries(csvData);
                let years = byYear.map(d => +d.key);
                // console.log(pathGenerator(world.features[0]));
                projection.fitSize([width, height], world);
                chartSvg
                    .selectAll('path')
                    .data(world.features)
                    .enter()
                    .append('path')
                    .classed('country', true)
                    .attr('d', d => pathGenerator(d));

                let i = 0;
                setInterval(() => {
                    if (i >= byYear.length) {
                        i = 0;
                    }
                    updateMap(byYear[i]);
                    i++;
                }, 500);
            }
        });

    function updateMap(kvp: { key: string, values: Array<any> }) {
        chartSvg.select('text').text(kvp.key);
        var first = kvp.values;
        colorScale.domain(extent(first, f => parseFloat(f.Score)));
        chartSvg.selectAll('path')
            .style('fill', d => {
                let index = first.filter(f => f.Code === d.properties.ADM0_A3);
                if (index.length > 0) {
                    let found = index[0];
                    // console.log(found)
                    return interpolateBlues(colorScale(parseFloat(found.Score)));
                }
            });
    }
}