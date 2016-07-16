import {select, selectAll} from 'd3-selection';
import { csv } from 'd3-request';
import { chart } from './chart';
import { dataFormat } from './models/dataFormat';

export function bootstrap() {
    var width = 1200;
    var height = 600;
    var div = select('#container');
    var container = div.append('svg')
        .attr('width', width)
        .attr('height', height);
    var c = new chart(container, width, height);


    csv('data/Orlando Mass Shooting.csv', (error, data:dataFormat[]) => {
        if (error) {
            console.error(error);
        }
        else {
            console.log(data);
            c.update(data);
        }
    })
}