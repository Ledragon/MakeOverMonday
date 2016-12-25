import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';
import { interpolateBlues } from 'd3-scale-chromatic';

export var mom40 = {
    name: 'mom40',
    component: {
        templateUrl: 'mom/40/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    const width = 960;
    const height = 640;
    let chartSvg = d3.select('#chart')
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
        .data(d3.range(0, 1, 0.01))
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


    let projection = d3.geoMercator();

    let pathGenerator = d3.geoPath()
        .projection(projection);
    drawMap();
    function drawMap() {

        let colorScale = d3.scaleLinear()
            .range([0, 1]);
        var q = d3.queue()
            .defer(d3.csv, 'mom/40/data/data.csv')
            .defer(d3.json, 'mom/40/data/countries.json')
            .await((error, csvData, world) => {
                if (error) {
                    console.error(error);
                } else {
                    let byYear = d3.nest<any>()
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
                        .attr('d', (d:any) => pathGenerator(d));

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
            colorScale.domain(d3.extent(first, f => parseFloat(f.Score)));
            chartSvg.selectAll('path')
                .style('fill', (d:any) => {
                    let index = first.filter(f => f.Code === d.properties.ADM0_A3);
                    if (index.length > 0) {
                        let found = index[0];
                        // console.log(found)
                        return interpolateBlues(colorScale(parseFloat(found.Score)));
                    }
                });
        }
    }
}

