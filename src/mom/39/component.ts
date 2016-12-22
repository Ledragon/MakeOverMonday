import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';
import { timeChart } from './charts/timeline';
import { schemeDark2 as color } from 'd3-scale-chromatic';

export var mom39 = {
    name: 'mom39',
    component: {
        templateUrl: 'mom/39/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    const width = 960;
    const height = 480;
    let plotMargins = {
        top: 50,
        bottom: 30,
        left: 80,
        right: 30
    };

    let p = plot.plot('#chart', width, height, plotMargins);
    let plotGroup = p.group();
    let plotHeight = p.height();
    let plotWidth = p.width();

    let tc = new timeChart(d3.select('svg'), width, height);

    const fileName = 'mom/39/data/data.csv';
    csvService.read<any>(fileName, update);

    function update(data: any) {
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
        d3.select('.left-menu')
            .selectAll('.country')
            .data(mapped)
            .enter()
            .append('div')
            .classed('country', true)
            .on('click', function (d) {
                let sel = d3.select(this);
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
    };
}