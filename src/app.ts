import { select, Selection } from 'd3-selection';
import { csv } from 'd3-request';
import { descending } from 'd3-array';

select('#chart')
    .append('svg')
    .attr('width', 800)
    .attr('height', 600);

csv('data/Container Shipping Companies 2016.csv',
    (d: any) => {
        return {
            rank: +d.Rank,
            company: d.Company,
            teu: +d['Total TEU']
        }
    }, (error, data) => {
        if (error) {
            console.error(error)
        } else {
            var top20 = data.sort((a, b) => descending(a.teu, b.teu))
                .splice(0, 20);
            console.log(top20);
        }
    })