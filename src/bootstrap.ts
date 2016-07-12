import {select, selectAll} from 'd3-selection';
export function bootstrap() {
    select('#container')
        .append('div')
        .text('hello world');
}