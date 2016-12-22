import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

export var mom42 = {
    name: 'mom42',
    component: {
        templateUrl: 'mom/42/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {

    let width = 1700;
    let height = 700;
    let margins = {
        top: 30,
        bottom: 50,
        left: 20,
        right: 20
    };

    let p = plot.plot('#chart', width, height, margins);
    let plotGroup = p.group();
    let plotHeight = p.height();
    let plotWidth = p.width();

    let stateScale = d3.scaleBand()
        .range([0, plotWidth]);

    let stateScaleGroup = plotGroup.append('g')
        .classed('axis', true);

    let stateAxis = d3.axisTop(stateScale);

    let seriesGroup = plotGroup.append('g')
        .classed('series', true);
    let colors = ['red', 'blue', 'green', 'gray'];
    let timeParser = d3.timeParse('%d-%m-%y')
    var q = d3.queue()
        .defer(d3.csv, 'mom/42/data/Votamatic.csv')
        .defer(d3.json, 'mom/42/data/us.geo.json');
    q.awaitAll((error, responses) => {
        if (error) {
            console.error(error);
        } else {
            update(responses);
        }
    });

    function update(responses: Array<Array<any>>) {
        let mapped = responses[0]
            .map(d => {
                return {
                    state: d.State,
                    clinton: parseFloat(d.Clinton),
                    trump: parseFloat(d.Trump),
                    other: parseFloat(d.Other),
                    undecided: parseFloat(d.Undecided),
                    date: timeParser(d.Date)
                }
            })

        let byDate = d3.nest<any>()
            .key(d => d.date)
            .entries(mapped);
        stateScale.domain(mapped.map(d => d.state));
        stateScaleGroup.call(stateAxis);
        // let timeScale = scaleTime()
        //     .domain(extent(byDate, d => d.date))
        //     .range([0, plotWidth]);

        let yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, plotHeight]);
        let dateFormat = d3.timeFormat('%B %d');
        let i = 0;
        setInterval(function () {
            if (i >= byDate.length) {
                i = 0;
            }
            d3.select('#date')
                .select('span')
                .text(dateFormat(new Date(byDate[i].key)));
            let databound = seriesGroup.selectAll('.series-individual')
                .data(byDate[i].values);
            let enterSelection = databound
                .enter()
                .append('g')
                .classed('series-individual', true)
                .attr('transform', d => `translate(${stateScale(d.state)},${0})`);
            let rectWidth = stateScale.bandwidth() / 2;
            enterSelection.append('rect')
                .classed('clinton', true)
                .attr('x', rectWidth / 2)
                .attr('y', 0)
                .attr('width', rectWidth)
                .attr('height', d => yScale(d.clinton));
            databound.select('.clinton')
                .attr('x', rectWidth / 2)
                .attr('y', 0)
                .attr('width', rectWidth)
                .attr('height', d => yScale(d.clinton));
            enterSelection.append('rect')
                .classed('trump', true)
                .attr('x', rectWidth / 2)
                .attr('y', d => yScale(d.clinton))
                .attr('width', rectWidth)
                .attr('height', d => yScale(d.trump));
            databound.select('.trump')
                .attr('x', rectWidth / 2)
                .attr('y', d => yScale(d.clinton))
                .attr('width', rectWidth)
                .attr('height', d => yScale(d.trump));
            enterSelection.append('rect')
                .classed('other', true)
                .attr('x', rectWidth / 2)
                .attr('y', d => yScale(d.clinton) + yScale(d.trump))
                .attr('width', rectWidth)
                .attr('height', d => yScale(d.other));
            databound.select('.other')
                .attr('x', rectWidth / 2)
                .attr('y', d => yScale(d.clinton) + yScale(d.trump))
                .attr('width', rectWidth)
                .attr('height', d => yScale(d.other));
            enterSelection.append('rect')
                .classed('undecided', true)

                .attr('x', rectWidth / 2)
                .attr('y', d => yScale(d.clinton) + yScale(d.trump) + yScale(d.other))
                .attr('width', rectWidth)
                .attr('height', d => yScale(d.undecided));
            databound.select('.undecided')

                .attr('x', rectWidth / 2)
                .attr('y', d => yScale(d.clinton) + yScale(d.trump) + yScale(d.other))
                .attr('width', rectWidth)
                .attr('height', d => yScale(d.undecided));
            databound.exit()
                .remove();
            // console.log(i)
            // databound.select('.clinton')
            //     .attr('x', 0)
            //     .attr('y', 0)
            //     .attr('width', stateScale.bandwidth())
            //     .attr('height', d => yScale(d.clinton));
            i++;
        }, 100);
    };
}