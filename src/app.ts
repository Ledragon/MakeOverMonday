import { select, Selection } from 'd3-selection';
import { csv } from 'd3-request';
import { nest } from 'd3-collection';
import { sum, max } from 'd3-array';
import { scaleLinear, schemeCategory10, ScaleLinear } from 'd3-scale';
import { line } from 'd3-shape';

let svg1 = select('#chart')
    .append('svg')
    .attr('width', 900)
    .attr('height', 780)

let svg2 = select('#chart2')
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

        let nestFct = nest()
            .key(d => d.Country);
        let byCountry2012 = nestFct
            .entries(bySurveyDate[0].values);
        let byCountry2015 = nestFct
            .entries(bySurveyDate[1].values);


        let c2 = svg2.append('g')
            .classed('c2015', true)
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

        let c1 = svg1.append('g')
            .classed('c2012', true)
            .attr('transform', `translate(${0},${0})`);
        drawChart(c1, mapData(byCountry2012), scale,'2012')
        drawChart(c2, mapData(byCountry2015), scale, '2015')
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

function mapData(data: Array<any>) {

    let mapped: Array<any> = data.map(d => {
        let total = sum(d.values, v => parseFloat(v.TOTAL));
        return {
            country: d.key,
            verySatisfied: sum(d.values, v => parseFloat(v['Very satisfied'])) / total,
            ratherSatisfied: sum(d.values, v => parseFloat(v['Rather satisfied'])) / total,
            ratherUnsatisfied: sum(d.values, v => parseFloat(v['Rather unsatisfied'])) / total,
            notAtAllSatisfied: sum(d.values, v => parseFloat(v['Not at all satisfied'])) / total,
            dontKnow: sum(d.values, v => parseFloat(v['Don\'t know'])) / total,
        };
    })
        .sort((a, b) => b.notAtAllSatisfied - a.notAtAllSatisfied);
    console.log(mapped);
    return mapped;
}

function drawChart(c1: Selection<any, any, any, any>, mapped: Array<any>, scale: ScaleLinear<any, number>, year:string) {
    let group = c1.append('g')
        .attr('transform', `translate(${0},${30})`)
    c1.append('g')
        .classed('title', true)
          .attr('transform', `translate(${450},${20})`)
        .append('text')
        .style('text-anchor','middle')
        .text(year);
    var enterSelection = group.selectAll('.country')
        .data(mapped)
        .enter()
        .append('g')
        .classed('country', true)
        .attr('transform', (d, i) => `translate(${0},${i * 22 + 10})`);

    enterSelection.append('text')
        .attr('x', 10)
        .attr('y', 15)
        .text((d, i) => d.country)
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
        .attr('x', d => scale(d.notAtAllSatisfied + d.ratherUnsatisfied))
        .attr('y', 0)
        .attr('height', 20)
        .style('fill', schemeCategory10[8])
        .attr('width', d => scale(d.ratherSatisfied))
    rects.append('rect')
        .attr('x', d => scale(d.notAtAllSatisfied + d.ratherUnsatisfied + d.ratherSatisfied))
        .attr('y', 0)
        .attr('height', 20)
        .style('fill', schemeCategory10[2])
        .attr('width', d => scale(d.verySatisfied))
    rects.append('rect')
        .attr('x', d => scale(d.ratherSatisfied + d.verySatisfied + d.ratherUnsatisfied + d.notAtAllSatisfied))
        .attr('y', 0)
        .attr('height', 20)
        .style('fill', schemeCategory10[9])
        .attr('width', d => scale(d.dontKnow))
}