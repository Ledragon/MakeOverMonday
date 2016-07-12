import { select, selectAll } from 'd3-selection/index';
export function bootstrap() {
    select('body')
        .append('div')
        .text('hello world')

}