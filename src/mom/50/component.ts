import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { LeftCategoricalAxis } from '../../charting/LeftCategorical';

export var mom50 = {
    name: 'mom50',
    component: {
        templateUrl: 'mom/50/template.html',
        controller: (csvService: any) => {
            let width = 800;
            let height = 830;
            let green = '#84B082';
            let red = '#885A5A';

            let plotMargins = {
                top: 30,
                bottom: 30,
                left: 120,
                right: 30
            };

            let p = plot.plot('#chart', width, height, plotMargins);
            let plotGroup = p.group();
            let plotHeight = p.height();
            let plotWidth = p.width();
            let yAxis = new LeftCategoricalAxis(plotGroup, plotWidth, plotHeight)
                .padding(.3);
            csvService.read('mom/50/data/data.csv',
                (data: Array<any>) => {
                    update(<any>data);
                },
                parseFunction);

            function update(data: IDataFormat) {
                var sorted = data.sort((a, b) => a.rank - b.rank);
                yAxis.domain(sorted.map(d => d.state));

                let scoreScale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.totalScore)])
                    .range([0, plotWidth]);
                let colorScale = d3.scaleLinear<any>()
                    .domain(d3.extent(data, d => d.totalScore))
                    .range([d3.rgb(green), d3.rgb(red)])
                    .interpolate(d3.interpolateHcl);
                plotGroup.selectAll('g.score')
                    .data(sorted)
                    .enter()
                    .append('g')
                    .classed('score', true)
                    .attr('transform', d => `translate(${0},${yAxis.scale(d.state)})`)
                    .append('rect')
                    .attr('width', d => scoreScale(d.totalScore))
                    .attr('height', yAxis.bandWidth())
                    .style('fill', d => colorScale(d.totalScore))
            }

            interface IDataFormat extends Array<any> {
                columns: string[];
            }

        }
    }
}

function parseFunction(d: any) {
    return {
        state: d.State,
        fatalities: parseInt(d['Fatalities Rate per 100 Million Vehicle Miles Traveled']),
        failureToObey: parseInt(d['Failure to Obey']),
        drunkDriving: parseInt(d['Drunk Driving']),
        speeding: parseInt(d['Speeding']),
        carelessDriving: parseInt(d['Careless Driving']),
        totalScore: parseInt(d['Total Score']),
        rank: parseInt(d['Rank']),
    };
}