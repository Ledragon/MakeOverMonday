import { select } from 'd3-selection';
import { csv } from 'd3-request';

import { countryRank } from './charts/countryRanks';

var w = 800;
var h = 600;
var countryRankSvg = select('#countryRank')
    .append('svg')
    .attr('width', 800)
    .attr('height', 600);

var rank = new countryRank(countryRankSvg, w, h);


csv<any, any>('data/Olympic Medal Table.csv',
    (d) => {
        return {
            edition: +d.Edition,
            rank: +d.Rank,
            country: d.Country,
            countryGroup: d['Country Group'],
            gold: +d.Gold,
            silver: +d.Silver,
            bronze: +d.Bronze,
            total: +d.Total
        };
    }
    , (error, data) => {
        if (error) {
            console.error(error)
        } else {
            rank.update(data);
        }
    });
