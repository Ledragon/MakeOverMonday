import { Selection, select } from 'd3-selection';
import { geoMercator, geoPath } from 'd3-geo';
import { json } from 'd3-request';
import { extent } from 'd3-array';
import * as _ from 'lodash';

import { blueScale, redScale } from './colorScale';

let proj = geoMercator();
let path = geoPath().projection(proj);
let _mapData: { features: Array<{ properties: { name: string, value?: number } }> };
let _dataBound: any;
let _data: Array<nameValue>;
let _container: Selection<any, any, any, any>;

export function draw(container: Selection<any, any, any, any>, width: number, height: number) {
    _container = container;
    json<any>('data/world.json', function (error, data) {
        if (error) {
            console.error(error);
        } else {
            _mapData = data;
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
            _dataBound = dataBound;
            if (_data) {
                update(_data);
            }
        }
    });

    return {
        update: update
    }
}

function update(data: Array<nameValue>) {
    _data = data;
    if (_mapData) {
        _mapData.features.forEach(f => f.properties.value = null);
        data.forEach(d => {
            var feature: any = _.find(_mapData.features, (f: any) => f.properties.name == d.name);
            if (feature) {
                feature.properties.value = d.value;
            }
        });
        let missing = data.filter(d => !_.find(_mapData.features, f => f.properties.name === d.name));
        console.log(missing);
        let domain = extent(data, d => d.value);
        let colorScale = redScale().domain(domain);
        _container
            .selectAll('.country')
            .data(_mapData.features)
            .select('path')
            .style('fill', function (d: any) {
                return d.properties.value ? colorScale(d.properties.value) : 'white';
            });
    }
}


interface nameValue {
    name: string;
    value: number;
}