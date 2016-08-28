import { Selection, select } from 'd3-selection';
import { geoMercator, geoPath } from 'd3-geo';
import { json } from 'd3-request';
import { extent } from 'd3-array';

import { blueScale } from './colorScale';
let proj = geoMercator();

let path = geoPath().projection(proj);

export function draw(container: Selection<any, any, any, any>, width: number, height: number) {
    json<any>('data/world.json', function (error, data) {
        if (error) {
            console.error(error);
        } else {
            proj.fitSize([width, height], data);
            var dataBound = container.selectAll('.country')
                .data(data.features);
            dataBound
                .exit()
                .remove();
            let enterSelection = dataBound
                .enter()
                .append('g')
                .classed('country', true);
            enterSelection.append('path')
                .attr('d', (d: any) => path(d));

        }
    });

    return {
        update: (data: Array<any>) => {
            let colorScale = blueScale().domain(extent(data, d => d.value));
            container.selectAll('.country')
                .select('path')
                .style('fill', 'gray');
        }
    }
}