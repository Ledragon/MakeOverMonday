import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

export var mom49 = {
    name: 'mom49',
    component: {
        templateUrl: 'mom/49/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    let width = 800;
    let height = 800;

    let plotMargins = {
        top: 30,
        bottom: 30,
        left: 30,
        right: 30
    };
    let p = plot.plot('#chart', width, height, plotMargins);
    let plotGroup = p.group();
    let plotHeight = p.height();
    let plotWidth = p.width();
    let colors = d3.schemeCategory10;
    let container = plotGroup.append('g')
        .attr('transform', `translate(${plotWidth / 2},${plotHeight / 2})`)

    let thicknesScale = d3.scaleLinear()
        .range([1, 100]);

    let lineGenerator = d3.line<any>()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveStep);

    csvService.read<any>('mom/49/data/data.csv', update, parseFunction);

    function update(data: Array<any>) {
        let byOriign = d3.nest<any>()
            .key(d => d.origin)
            .entries(data);
        let radius = 80;
        let globalRadius = (plotWidth - plotMargins.left) / 2 - radius;
        let keys = byOriign.map(d => d.key);

        thicknesScale.domain(d3.extent(data, d => d['2005']));
        let linesSelection = container.selectAll('g.line')
            .data(data)
            .enter()
            .append('g')
            .classed('line', true);
        linesSelection
            .append('path')
            .attr('d', (d) => {
                var origin = position(d, globalRadius, keys.length, keys.indexOf(d.origin));
                var destination = position(d, globalRadius, keys.length, keys.indexOf(d.destination));
                let diffX = destination[0] - origin[0];
                let diffY = destination[1] - origin[1];
                // let ratio = 4 / 3;
                let moveX = 1 / 3 * diffX;//ratio * diffX;
                let moveY = 1 / 3 * diffY;
                var points = [
                    { x: origin[0], y: origin[1] },
                    { x: origin[0] + moveX, y: origin[1] + moveY },
                    { x: origin[0] + moveX, y: origin[1] + moveY },
                    { x: destination[0], y: destination[1] }
                ]
                return lineGenerator(points);
            })
            .style('fill', 'none')
            .style('stroke', (d, i) => colors[keys.indexOf(d.origin)])
            .style('stroke-width', d => thicknesScale(d['2005']));

        let enterSelection = container.selectAll('g.origin')
            .data(byOriign)
            .enter()
            .append('g')
            .classed('origin', true)
            .attr('transform', (d, i) => {
                let pos = position(d, globalRadius, byOriign.length, i)
                return `translate(${pos[0]},${pos[1]})`
            });
        enterSelection.append('circle')
            .attr('r', radius)
            .style('fill', 'rgba(255,255,255,0.8)')
            .style('stroke', (d, i) => colors[i]);
        enterSelection.append('text')
            .style('text-anchor', 'middle')
            .text(d => d.key);
    }

    function position(d: any, globalRadius: number, itemsCount: number, i: number): [number, number] {
        let angle = i / itemsCount * 2 * Math.PI
        return [globalRadius * (Math.cos(angle)), globalRadius * (Math.sin(angle))];
    }

}

function parseFunction(d: any) {
    return {
        origin: d['Origin'],
        destination: d['Destination'],
        '1990': parseFloat(d['1990']),
        '1995': parseFloat(d['1995']),
        '2000': parseFloat(d['2000']),
        '2005': parseFloat(d['2005']),
    };
}
}