import { select } from 'd3-selection';

import { read } from './services/dataService';
import { rawData } from './models/data';
import { draw } from './charts/map';
import { timeline } from './charts/timeline';
/******************************************************* */
let w = 800;
let h = 600;
let map = select('#map')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

let mapChart = draw(map, w, h);

let timelineContainer = select('#timeline');
let timelineChart = timeline(timelineContainer, 200, 200);
const filePath = 'data/Malaria.csv';
read(filePath, update);

/******************************************************* */
function update(data: rawDataObject) {
    // console.log(data);
    // var mapped = data.map(d => {
    //     return {
    //         name: d.Country,
    //         value: +d['2014']
    //     }
    // })
    // console.log(mapped)
    // mapChart.update(mapped);
    timelineChart.clickCallback(year => {
        var mapped = data.map(d => {
            return {
                name: d.Country,
                value: +d[year]
            }
        });
        mapChart.update(mapped);
    });
    timelineChart.update(data.columns.splice(1, data.columns.length));

}

interface rawDataObject extends Array<rawData> {
    columns: Array<string>;
}