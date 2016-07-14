import {select, selectAll} from 'd3-selection';
import { csv } from 'd3-request';
import { chart } from './chart';

export function bootstrap() {
    var div = select('#container');
    var container = div.append('svg')
        .attr('width', 800)
        .attr('height', 600);
    var c = new chart(container, 800, 600);


    csv('data/Orlando Mass Shooting.csv', (error, data) => {
        if (error) {
            console.error(error);
        }
        else {
            console.log(data);
        }
    })
}

