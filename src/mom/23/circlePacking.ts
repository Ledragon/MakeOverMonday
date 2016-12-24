import * as d3 from 'd3';

export function draw(data: Array<any>) {

    var pack = d3.pack<any>()
        .padding(2)
        .size([600, 600])
        .value(d => d.amount);
    var byYear = d3.nest<any>()
        .key((d) => d.year)
        .entries(data);
    var sources = d3.nest<any>()
        .key((d) => d.energySource)
        .entries(data);
    var sourceNames = sources.map(d => d.key);
    var c10 = d3.scale.category10()
        .domain(sourceNames);
    var total = d3.sum(data, d => d.amount);
    var hierarchical = {
        name: 'total',
        amount: total,
        children: byYear.map((d: any) => {
            return {
                name: d.key,
                amount: d3.sum(d.values, v => v.amount),
                children: d.values.map(v => {
                    return {
                        name: v.energySource,
                        amount: v.amount,
                        energySource: v.energySource
                    }
                })
            }
        })
    }
    var nodes:Array<any> = pack.nodes(hierarchical);
    var node = d3.select('#circles')
        .append('g')
        .classed('packed-circles', true)
        .selectAll('.node')
        .data(nodes)
        .enter()
        .append('g')
        .classed('node', true)
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
    node.append('circle')
        .attr('r', d => d.r)
        .style('fill', d => d.energySource ? c10(d.energySource) : '');
    node.append('text')
        .attr('x', 30)
        .attr('y', 50)
        .text(d => d.children ? d.name : '');
}