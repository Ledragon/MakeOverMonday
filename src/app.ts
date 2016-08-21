import { select } from 'd3-selection';
import { csv } from 'd3-request';

var w = 800;
var h = 600;
var countryRankSvg = select('#countryRank')
    .append('svg')
    .attr('width', 800)
    .attr('height', 600);

csv<any, any>('data/Olympic Medal Table.csv',
    (d) => {
        return {
            
        };
    }
    , (error, data) => {
        if (error) {
            console.error(error)
        } else {
            console.log(data)
        }
    });
