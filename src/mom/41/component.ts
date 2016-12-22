import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

export var mom41 = {
    name: 'mom41',
    component: {
        templateUrl: 'mom/41/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {

    let svg1 = d3.select('#chart')
        .append('svg')
        .attr('width', 900)
        .attr('height', 780)

    let svg2 = d3.select('#chart2')
        .append('svg')
        .attr('width', 900)
        .attr('height', 780)



    const fileName = 'mom/41/data/data.csv';
    csvService.read<any>(fileName, update);

    function update(data: Array<any>) {
        console.log(data);


        let bySurveyDate = d3.nest<any>()
            .key(d => d['Survey Date'])
            .entries(data);

        let nestFct = d3.nest<any>()
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
        let scale = d3.scaleLinear()
            .range([0, 600])
            .domain([0, 1]);

        let c1 = svg1.append('g')
            .classed('c2012', true)
            .attr('transform', `translate(${0},${0})`);
        drawChart(c1, mapData(byCountry2012), scale, '2012')
        drawChart(c2, mapData(byCountry2015), scale, '2015')



    };
}


function mapData(data: Array<any>) {

    let mapped: Array<any> = data.map(d => {
        let total = d3.sum(d.values, v => parseFloat(v.TOTAL));
        return {
            country: d.key,
            verySatisfied: d3.sum(d.values, v => parseFloat(v['Very satisfied'])) / total,
            ratherSatisfied: d3.sum(d.values, v => parseFloat(v['Rather satisfied'])) / total,
            ratherUnsatisfied: d3.sum(d.values, v => parseFloat(v['Rather unsatisfied'])) / total,
            notAtAllSatisfied: d3.sum(d.values, v => parseFloat(v['Not at all satisfied'])) / total,
            dontKnow: d3.sum(d.values, v => parseFloat(v['Don\'t know'])) / total,
        };
    })
        .sort((a, b) => b.notAtAllSatisfied - a.notAtAllSatisfied);
    console.log(mapped);
    return mapped;
}

function drawChart(c1: d3.Selection<any, any, any, any>, mapped: Array<any>, scale: d3.ScaleLinear<any, number>, year: string) {
    let group = c1.append('g')
        .attr('transform', `translate(${0},${30})`)
    c1.append('g')
        .classed('title', true)
        .attr('transform', `translate(${450},${20})`)
        .append('text')
        .style('text-anchor', 'middle')
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
        .style('fill', d3.schemeCategory10[3])
        .attr('width', d => scale(d.notAtAllSatisfied))

    rects.append('rect')
        .attr('x', d => scale(d.notAtAllSatisfied))
        .attr('y', 0)
        .attr('height', 20)
        .style('fill', d3.schemeCategory10[1])
        .attr('width', d => scale(d.ratherUnsatisfied))

    rects.append('rect')
        .attr('x', d => scale(d.notAtAllSatisfied + d.ratherUnsatisfied))
        .attr('y', 0)
        .attr('height', 20)
        .style('fill', d3.schemeCategory10[8])
        .attr('width', d => scale(d.ratherSatisfied))
    rects.append('rect')
        .attr('x', d => scale(d.notAtAllSatisfied + d.ratherUnsatisfied + d.ratherSatisfied))
        .attr('y', 0)
        .attr('height', 20)
        .style('fill', d3.schemeCategory10[2])
        .attr('width', d => scale(d.verySatisfied))
    rects.append('rect')
        .attr('x', d => scale(d.ratherSatisfied + d.verySatisfied + d.ratherUnsatisfied + d.notAtAllSatisfied))
        .attr('y', 0)
        .attr('height', 20)
        .style('fill', d3.schemeCategory10[9])
        .attr('width', d => scale(d.dontKnow))
}