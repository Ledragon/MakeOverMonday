import { csv, json } from 'd3-request';
import { select } from 'd3-selection';

csv('data/Global Peach Index.csv', function (error: any, data: any) {
    if (error) {
        console.error(error);
    }
    else {
        let countries = data.map(d => d.Country);
        select('#countries')
            .selectAll('.country')
            .data(countries)
            .enter()
            .append('div')
            .on('click', function (d) {
                let sel = select(this);
                let hasClass = sel.classed('highlight');
                sel.classed('highlight', !hasClass);
            })
            .text(d => d);
        
        json('data/world.json', function (e, d) {
            console.log(d)
        })
    }
})