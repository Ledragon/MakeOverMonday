import { csv, json, request } from 'd3-request';
import { select } from 'd3-selection';
import { queue } from 'd3-queue';
import { nest } from 'd3-collection';
import { max, extent } from 'd3-array';
import { geoMercator, geoPath } from 'd3-geo';
import { scaleLinear } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';


let node = (select('.content').node() as any).getBoundingClientRect();
let width = node.width;//- 20;
let height = node.height;// - 10;
let chartSvg = select('.content')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
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

            let projection = geoMercator()
                .fitSize([width, height], world);
            let pathGenerator = geoPath()
                .projection(projection);
            // console.log(pathGenerator(world.features[0]));
            chartSvg
                .selectAll('path')
                .data(world.features)
                .enter()
                .append('path')
                .classed('country', true)
                .attr('d', d => pathGenerator(d));

            var first = byYear[0].values;
            colorScale.domain(extent(first, f => parseFloat(f.Score)));
            console.log(colorScale.domain())
            chartSvg.selectAll('path')
                .style('fill', d => {
                    let index = first.filter(f => f.Code === d.properties.ADM0_A3);
                    if (index.length > 0) {
                        let found = index[0];
                        console.log(found)
                        return interpolateBlues(colorScale(parseFloat(found.Score)));
                    }
                })

        }
    });

// q.defer(csv('data/Global Peace Index 2016.csv'))
// csv('data/Global Peace Index 2016.csv', function (error: any, data: any) {
//     if (error) {
//         console.error(error);
//     }
//     else {
//         console.log(data);
//     }
// })