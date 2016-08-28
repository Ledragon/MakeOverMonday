import { select } from 'd3-selection';

import { read } from './services/dataService';
import { rawData } from './models/data';
import { draw } from './charts/map';
/******************************************************* */
let w = 800;
let h = 600;
let map = select('#map')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

draw(map, w, h);

const filePath = 'data/Malaria.csv';
read(filePath, update);

/******************************************************* */
function update(data: Array<rawData>) {
    console.log(data);
}