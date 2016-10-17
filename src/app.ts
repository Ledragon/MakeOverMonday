import { csv } from 'd3-request';
import { nest } from 'd3-collection';
import { sum } from 'd3-array';
import { scaleLinear, schemeCategory10 } from 'd3-scale';
import { line } from 'd3-shape';

csv('data/data.csv', (error, data) => {
    if (error) {
        console.error(error);
    } else {
        console.log(data.columns)
        let bySurveyDate = nest()
            .key(d => d['Survey Date'])
            .entries(data);
        

        let byCountry2012 = nest()
            .key(d => d.Country)
            .entries(bySurveyDate[0].values);
        

        console.log(byCountry2012)
        let mapped = byCountry2012.map(d => {
            return {
                country: d.key,
                total: sum(d.values, v => parseFloat(v.TOTAL)),
                verySatisfied: sum(d.values, v => parseFloat(v['Very satisfied'])),
                ratherSatisfied: sum(d.values, v => parseFloat(v['Rather satisfied'])),
                ratherUnsatisfied: sum(d.values, v => parseFloat(v['Rather unsatisfied'])),
                notAtAllSatisfied: sum(d.values, v => parseFloat(v['Not at all satisfied'])),
                dontKnow: sum(d.values, v => parseFloat(v['Don\'t know'])),
            };
        });
    }
});