import { csv, json, request } from 'd3-request';
import { select } from 'd3-selection';
import { queue } from 'd3-queue';
import { interpolateBlues } from 'd3-scale-chromatic';


let node = (select('.content').node() as any).getBoundingClientRect();
let width = node.width;//- 20;
let height = node.height;// - 10;
let chartSvg = select('.content')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

var q = queue()
    .defer(csv, 'data/Global Peace Index 2016.csv')
    .defer(json, 'data/world.json')
    .await((error, csvData, world) => {
        if (error) {
            console.error(error);
        } else {
            console.log(csvData);
            console.log(world);
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