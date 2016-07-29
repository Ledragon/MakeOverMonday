import { csv } from 'd3-request';
import {select} from 'd3-selection';
import { timeParse } from 'd3-time-format';
import { nest } from 'd3-collection';

import { dataFormat } from './typings-custom/dataFormat';
import { evolution } from './charts/evolution';

function app() {
    // var census = createChart('census', 800, 600, true);
    // var birth = createChart('birth', 800, 600, true);
    var row = select('div.row');
    csv<any, dataFormat>('data/Bermuda-Digest-of-Statistics.csv', d => {
        return {
            category: d['Category'],
            year: +d['Year'],
            total: +d['Total'],
            male: d['Male'] ? +d['Male'] : null,
            female: d['Female'] ? +d['Female'] : null
        };
    }, (error, data) => {
        if (error) {
            console.error(error);
        }
        else {
            var byCategory = nest<dataFormat>()
                .key(d => d.category)
                .entries(data);
            byCategory.forEach((d, i) => {
                var name = `number${i}`;
                var div = row.append('div')
                    .classed('col-4', true)
                    .attr('id', name);
                var chart = createChart(name, 400, 300, false);
                chart.update(d.values);
            });
            // var censusData = byCategory.filter(d => d.key === 'Census')[0].values;
            // census.update(censusData);
            // var birthData = byCategory.filter(d => d.key === 'Live Births')[0].values;
            // birth.update(birthData);
        }
    })
}

function createChart(containerId: string, width: number, height: number, showGender: boolean): evolution {
    var container = select(`#${containerId}`)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var c = new evolution(container, width, height);
    c.showGender(showGender);
    return c;
}
app();