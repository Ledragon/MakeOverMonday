import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

export var mom37 = {
    name: 'mom37',
    component: {
        templateUrl: 'mom/37/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    const width = 800;
    const height = 600;
    let plotMargins = {
        top: 50,
        bottom: 30,
        left: 80,
        right: 30
    };

    let p = plot.plot('#chart', width, height, plotMargins);
    let plotGroup = p.group();
    let plotHeight = p.height();
    let plotWidth = p.width();
    let parseFunction = (d: any) => {
        return {
            rank: +d.Rank,
            company: d.Company,
            teu: +d['Total TEU'],
            parent: 'root'
        }
    };
    
    const fileName = 'mom/37/data/Container Shipping Companies 2016.csv';
    csvService.read<any>(fileName, update, parseFunction);

    function update(data: Array<any>) {
        var top20 = data.sort((a, b) => d3.descending(a.teu, b.teu))
                .splice(0, 20);
            top20.push({
                company: 'root',
                rank: -1,
                teu: -1,
                parent: ''
            });
            let layout = d3.pack()
                .size([800, 600])
                .padding(3);
            var hierarchy = d3.stratify<any>()
                .id(d => d.company)
                .parentId(d => d.parent)
                (top20);
            let svg = d3.select('svg');
            // let interpolate = interpolateRgbBasis(['#3f7cac', '#d5e1a3']);
            let colorScale = d3.scaleLinear<string, number>()
                .range(['#0D0221', '#C2E7D9'])
                .interpolate(d3.interpolateHcl)
                .domain(d3.extent(top20, d => d.teu));
            hierarchy.sum(d => d.teu);
            let laidOut = layout(hierarchy);
            var dataBound = svg.selectAll('.circle')
                .data(laidOut.children);
            dataBound
                .exit()
                .remove();
            let enterSelection = dataBound
                .enter()
                .append('g')
                .classed('circle', true)
                .on('mouseenter', function (d, i) {
                    console.log(d);
                    let legend = d3.select(this)
                        .append('g')
                        .classed('legend', true)
                        .attr('transform', (d,i)=>`translate(${-75},${0})`);
                    legend.append('rect')
                        .attr('width', 150)
                        .attr('height', 50)
                        .attr('fill', 'rgba(255,255,255,0.75)');
                    legend.append('text')
                        .attr('transform', `translate(${10},${20})`)
                        .attr('font-size', '11px')
                        .text(`${d.data.company}`)
                    legend.append('text')
                        .attr('transform', `translate(${10},${40})`)
                        .attr('font-size', '11px')
                        .text(`${d.data.teu}`)

                })
                .on('mouseleave', function (d, i) {
                    d3.select(this).select('g.legend').remove();
                });
            enterSelection.attr('transform', d => `translate(${d.x},${d.y})`)
                .append('circle')
                .attr('fill', d => colorScale(d.data.teu))
                .attr('r', d => d.r);
            enterSelection.append('text')
                .attr('text-anchor', 'middle')
                .attr('font-size', '13px')
                .text(d => d.r > 50 ? d.id : '')
    };
}