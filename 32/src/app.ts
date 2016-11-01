import { select } from 'd3-selection';
import { csv } from 'd3-request';

import { countryRank } from './charts/countryRanks';
import { selector } from './charts/selector';

var w = 800;
var h = 600;
var countryRankSvg = select('#countryRank')
    .append('svg')
    .attr('width', 800)
    .attr('height', 600);

var rank = new countryRank(countryRankSvg, w, h);


// var w1 = 800;
// var h1 = 40;
// var selectorSvg = select('#selector')
//     .append('svg')
//     .attr('width', w1)
//     .attr('height', h1);
// var s = new selector(selectorSvg, w1, h1);

csv<any, any>('data/Olympic Medal Table.csv',
    (d) => {
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
    , (error, data) => {
        if (error) {
            console.error(error)
        } else {
            rank.update(data);
            // s.update(data.map(d => d.edition));
        }
    });
