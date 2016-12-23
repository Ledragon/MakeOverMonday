import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

import { mappedFormat } from './models/mapped';
import { bySubsidiariesCount } from './charts/bySubsidiariesCount';

export var mom35 = {
    name: 'mom35',
    component: {
        templateUrl: 'mom/35/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    var w = 800;
    var h = 800;
    var subsidiariesSvg = d3.select('#chart')
        .append('svg')
        .attr('width', w)
        .attr('height', h);


    var sub = bySubsidiariesCount(subsidiariesSvg, w, h)
        .valueFn(d => d.subsidiariesCount)
        .title('Tax haven subsidiaries');
    var byAmountSvg = d3.select('#byAmount')
        .append('svg')
        .attr('width', w)
        .attr('height', h)

    var byAmount = bySubsidiariesCount(byAmountSvg, w, h)
        .valueFn(d => d.amount)
        .title('Amount (Million $)');



    const fileName = 'mom/35/data/Corporate Tax Havens.csv';
    csvService.read<any>(fileName, update);

    function update(data: Array<any>) {
        var mapped: Array<mappedFormat> = data.map(d => {
            return {
                company: d['Company'],
                subsidiariesCount: +d['Tax Haven Subsidiaries'],
                amount: +d['Amount Held Offshore ($ millions)'],
                subsidiariesLocation: d['Location of Tax Haven Subsidiaries'].split(',')
            }
        });
        sub.update(mapped);
        byAmount.update(mapped);
    };
}