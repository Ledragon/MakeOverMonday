import { csv } from 'd3-request';
import { select } from 'd3-selection';
import { nest } from 'd3-collection';
import { descending } from 'd3-array';

import { statistics } from '../charts/statistics';
import { chart } from '../charts/chart';

interface dataFormat {
    year: number;
    recordsStolen: number;
    recordsLost: number;
    company: string;
}
csv('data/Data Breaches.csv', (d: any) => {
    return {
        year: +d.Year,
        company: d.Entity,
        recordsStolen: +d['Records Stolen'],
        recordsLost: +d['Records Lost']
    }
}
    , function (error, data) {
        if (error) {
            console.error(error);
        } else {
            var stats = new statistics(select('#statistics'), 200, 500);
            stats.update(data);

            let chartSelection = select('#chart')
                .append('svg')
                .attr('width', 1200)
                .attr('height', 600)
            var ch = new chart(chartSelection, 1200, 600);
            ch.update(data);
        }
    })