import {select, selectAll} from 'd3-selection';
import { csv } from 'd3-request';
export function bootstrap() {
    select('#container')
        .append('div')
        .text('hello world');
    csv('data/Orlando Mass Shooting.csv', (error, data) => {
        if (error) {
            console.error(error);
        }
        else {
            console.log(data);
        }
    })
}

