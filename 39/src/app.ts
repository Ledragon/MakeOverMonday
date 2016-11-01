import { csv, json } from 'd3-request';
import { select } from 'd3-selection';
import { schemeDark2 as color } from 'd3-scale-chromatic';

import { timeChart } from './charts/timeline';

let node = (select('.content').node() as any).getBoundingClientRect();
console.log(node)
let width = node.width - 20;
let height = node.height - 10;
let chartSvg = select('.content')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

let tc = new timeChart(chartSvg, width, height);

csv('data/Global Peach Index.csv', function (error: any, data: any) {
    if (error) {
        console.error(error);
    }
    else {
        // let countries:Array<string> = data.map(d => d.Country);
        let years = data.columns.splice(3, data.columns.length - 1).map(d => +d);
        let mapped = data.map(d => {
            return {
                name: d.Country,
                values: years.map(y => {
                    return {
                        year: y,
                        value: +d[y]
                    };
                })
            }
        })
        var selected: Array<any> = [];
        select('.left-menu')
            .selectAll('.country')
            .data(mapped)
            .enter()
            .append('div')
            .classed('country', true)
            .on('click', function (d) {
                let sel = select(this);
                // let hasClass = sel.classed('highlight');
                // sel.classed('highlight', !hasClass);
                var indexOf = selected.indexOf(d);
                if (indexOf >= 0) {
                    selected.splice(indexOf, 1);
                    sel.style('background', '');
                } else {
                    selected.push(d);
                    indexOf = selected.indexOf(d);
                    sel.style('background', color[indexOf]);
                }
                d.color = color[indexOf];
                tc.update(selected);
            })
            .text(d => d.name);

        tc.updateYears(years);
    }
})