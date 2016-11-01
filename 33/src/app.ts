import { select } from 'd3-selection';
import { csv } from 'd3-request';
import { nest } from 'd3-collection';

import { chart } from './chart';
import { dataFormat } from './dataFormat';

var w = 800;
var h = 600;

let svg = select('#chart')
    .append('svg')
    .attr('width', w)
    .attr('height', h);
let c = new chart(svg, w, h);
csv<any, dataFormat>('data/data.csv',
    (d) => {
        return {
            category: d.Category,
            product: d.Product,
            current: d['2014'],
            previous: d['2013'],
            'change': parseFloat(d['% Change'])/100
        };
    }
    , (error: any, data: Array<dataFormat>) => {
        if (error) {
            console.error(error)
        } else {
            c.update(data);
        }
    });
