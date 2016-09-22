import { csv } from 'd3-request';
import { select } from 'd3-selection';
import { nest } from 'd3-collection';
import { descending } from 'd3-array';

interface dataFormat {
    year: number;
    recordsStolen: number;
    recordsLost: number;
    company: string;
}
csv('data/Data Breaches.csv', (d: any) => {
    return {
        year: +d.Year,
        company: d.Entity,
        recordsStolen: +d['Records Stolen'],
        recordsLost: +d['Records Lost']
    }
}
    , function (error, data) {
        if (error) {
            console.error(error);
        } else {
            console.log(data);
            // var desc = descending((a,b)=>a.
            var byCompany = nest<dataFormat>()
                .key(d => d.year.toString())
                .entries(data)
                .sort((a,b)=>b.values.length-a.values.length);
            console.log(byCompany);
        }
    })