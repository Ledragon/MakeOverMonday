import { select } from 'd3-selection';
import { csv } from 'd3-request';
import { nest } from 'd3-collection';
import { sum, max } from 'd3-array';
import { scaleLinear, schemeCategory10 } from 'd3-scale';
import { line } from 'd3-shape';

let svg1 = select('#chart')
    .append('svg')
    .attr('width', 900)
    .attr('height', 780)

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
            let total = sum(d.values, v => parseFloat(v.TOTAL));
            return {
                country: d.key,
                verySatisfied: sum(d.values, v => parseFloat(v['Very satisfied']))/total,
                ratherSatisfied: sum(d.values, v => parseFloat(v['Rather satisfied']))/total,
                ratherUnsatisfied: sum(d.values, v => parseFloat(v['Rather unsatisfied']))/total,
                notAtAllSatisfied: sum(d.values, v => parseFloat(v['Not at all satisfied']))/total,
                dontKnow: sum(d.values, v => parseFloat(v['Don\'t know']))/total,
            };
        });
        console.log(mapped);
        let c1 = svg1.append('g')
            .classed('c2012', true)
            .attr('transform', `translate(${0},${0})`);
        // c1.append('text')
        //     .style('text-anchor', 'middle')
        //     .attr('x', 200)
        //     .attr('y', 0)
        //     .text('Total')
        // c1.append('text')
        //     .style('text-anchor', 'middle')
        //     .attr('x', 300)
        //     .attr('y', 0)
        //     .text('Very')
        let scale = scaleLinear()
            .range([0, 600])
            .domain([0, 1]);
        var enterSelection = c1.selectAll('.country')
            .data(mapped)
            .enter()
            .append('g')
            .classed('country', true)
            .attr('transform', (d, i) => `translate(${0},${i * 22 + 10})`);

        enterSelection.append('text')
            .attr('x', 10)
            .attr('y', 15)
            .text((d, i) => i + '. ' + d.country)
        let rects = enterSelection.append('g')
            .classed('rects', true)
            .attr('transform', `translate(${200},${0})`);
        
        rects.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', 20)
            .style('fill', schemeCategory10[3])
            .attr('width', d => scale(d.notAtAllSatisfied))
        
        rects.append('rect')
            .attr('x', d => scale(d.notAtAllSatisfied))
            .attr('y', 0)
            .attr('height', 20)
            .style('fill', schemeCategory10[1])
            .attr('width', d => scale(d.ratherUnsatisfied))
        
        rects.append('rect')
            .attr('x', d => scale(d.notAtAllSatisfied+d.ratherUnsatisfied))
            .attr('y', 0)
            .attr('height', 20)
            .style('fill', schemeCategory10[8])
            .attr('width', d => scale(d.ratherSatisfied))
        rects.append('rect')
            .attr('x', d => scale(d.notAtAllSatisfied+d.ratherUnsatisfied+d.ratherSatisfied))
            .attr('y', 0)
            .attr('height', 20)
            .style('fill', schemeCategory10[2])
            .attr('width', d => scale(d.verySatisfied))
        rects.append('rect')
            .attr('x', d => scale(d.ratherSatisfied+d.verySatisfied+d.ratherUnsatisfied+d.notAtAllSatisfied))
            .attr('y', 0)
            .attr('height', 20)
            .style('fill', schemeCategory10[0])
            .attr('width', d => scale(d.dontKnow))
        // enterSelection.append('text')
        //     .style('text-anchor', 'middle')
        //     .attr('x', 200)
        //     .attr('y', 15)
        //     .text((d, i) => d.total)
        // enterSelection.append('text')
        //     .style('text-anchor', 'middle')
        //     .attr('x', 300)
        //     .attr('y', 15)
        //     .text((d, i) => d.verySatisfied)
    }
});