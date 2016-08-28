import { Selection, select } from 'd3-selection';
import { geoMercator, geoPath } from 'd3-geo';
import { json } from 'd3-request';
import { extent } from 'd3-array';
import * as _ from 'lodash';

import { blueScale } from './colorScale';

let proj = geoMercator();
let path = geoPath().projection(proj);
let _mapData: any;
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
        data.forEach(d => {
            var feature: any = _.find(_mapData.features, (f: any) => f.properties.name == d.name);
            if (feature) {
                feature.properties.value = d.value;
            }
        });
        // _mapData.features.forEach((d: any) => {
        //     d.properties = d.properties || {};
        //     d.properties.value = _.find(data, dd => dd.name === d.properties.name).value;
        // });
        let colorScale = blueScale().domain(extent(data, d => d.value));
        _container
            .selectAll('.country')
            .data(_mapData.features)
            .select('path')
            .style('fill', function (d: any) {
                return d.properties.value ? colorScale(d.properties.value) : '';
            });
    }
}


interface nameValue {
    name: string;
    value: number;
}