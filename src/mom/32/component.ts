import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

import { countryRank } from './charts/countryRanks';
import { selector } from './charts/selector';

export var mom32 = {
    name: 'mom32',
    component: {
        templateUrl: 'mom/32/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {

    var w = 800;
    var h = 600;
    var countryRankSvg = d3.select('#chart')
        .append('svg')
        .attr('width', 800)
        .attr('height', 600);

    var rank = new countryRank(countryRankSvg, w, h);


    let parseFunction = (d) => {
        return {
            edition: +d.Edition,
            rank: +d.Rank,
            country: d.Country,
            countryGroup: d['Country Group'],
            // gold: +d.Gold,
            // silver: +d.Silver,
            // bronze: +d.Bronze,
            total: d.Total ? +d.Total : 0
        };
    }

    const fileName = 'mom/32/data/Olympic Medal Table.csv';
    csvService.read<any>(fileName, update, parseFunction);

    function update(data: Array<any>) {
        rank.update(data);
    };
}