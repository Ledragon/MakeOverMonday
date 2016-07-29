import { csv } from 'd3-request';
import {select,selectAll} from 'd3-selection';
import { timeParse } from 'd3-time-format';
import { nest } from 'd3-collection';

import { dataFormat } from './typings-custom/dataFormat';
import { evolution } from './charts/evolution';

function app() {
    var census = createChart('chart', 800, 600, true);
    // var birth = createChart('birth', 800, 600, true);
    var menuContainer = select('#menu');
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
            var menuItems = menuContainer.selectAll('.menu-item')
                .data(byCategory);
            menuItems
                .exit()
                .remove();
            var enterSelection = menuItems
                .enter()
                .append('div')
                .classed('menu-item', true)
                .on('click', function (d, i) {
                    selectAll('.menu-item').style('background', '');
                    select(this).style('background','beige')
                    census.titleText(d.key);
                    census.update(d.values);
                });
            enterSelection.append('span')
                .text(d => d.key);
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