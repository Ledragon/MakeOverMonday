import { descending } from 'd3-array';
import { select } from 'd3-selection';

import { read } from './services/dataService';
import { mappedFormat } from './models/mapped';
import { bySubsidiariesCount } from './charts/bySubsidiariesCount';

var w = 800;
var h = 800;
var subsidiariesSvg = select('#chart')
.append('svg')    
    .attr('width', w)
    .attr('height', h);

var sub = bySubsidiariesCount(subsidiariesSvg, w, h);


read('data/Corporate Tax Havens.csv', (data: Array<any>) => {
    var mapped: Array<mappedFormat> = data.map(d => {
        return {
            company: d['Company'],
            subsidiariesCount: +d['Tax Haven Subsidiaries'],
            amount: +d['Amount Held Offshore ($ millions)'],
            subsidiariesLocation: d['Location of Tax Haven Subsidiaries'].split(',')
        }
    });
    sub.update(mapped);
});