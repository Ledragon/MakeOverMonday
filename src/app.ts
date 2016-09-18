import { select, Selection } from 'd3-selection';
import { csv } from 'd3-request';
import { descending, extent } from 'd3-array';
import { pack, stratify } from 'd3-hierarchy';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { interpolateHcl } from 'd3-interpolate';

let svg = select('#chart')
    .append('svg')
    .attr('width', 800)
    .attr('height', 600);

csv('data/Container Shipping Companies 2016.csv',
    (d: any) => {
        return {
            rank: +d.Rank,
            company: d.Company,
            teu: +d['Total TEU'],
            parent: 'root'
        }
    }, (error, data) => {
        if (error) {
            console.error(error)
        } else {
            var top20 = data.sort((a, b) => descending(a.teu, b.teu))
                .splice(0, 20);
            top20.push({
                company: 'root',
                rank: -1,
                teu: -1,
                parent: ''
            });
            let layout = pack()
                .size([800, 600])
                .padding(3);
            var hierarchy = stratify<any>()
                .id(d => d.company)
                .parentId(d => d.parent)
                (top20);
            // let interpolate = interpolateRgbBasis(['#3f7cac', '#d5e1a3']);
            let colorScale = scaleLinear<string, number>()
                .range(['#0D0221', '#C2E7D9'])
                .interpolate(interpolateHcl)
                .domain(extent(top20, d => d.teu));
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
                    let legend = select(this)
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
                    select(this).select('g.legend').remove();
                });
            enterSelection.attr('transform', d => `translate(${d.x},${d.y})`)
                .append('circle')
                .attr('fill', d => colorScale(d.data.teu))
                .attr('r', d => d.r);
            enterSelection.append('text')
                .attr('text-anchor', 'middle')
                .attr('font-size', '13px')
                .text(d => d.r > 50 ? d.id : '')
        }
    })