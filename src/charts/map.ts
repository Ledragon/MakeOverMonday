import { Selection, select, selectAll } from 'd3-selection';
import { GeoPath, geoPath, geoMercator } from 'd3-geo';
// import { geoMercatorRaw } from 'd3-geo-projection';
import { json } from 'd3-request';

export class map {
    private _group: Selection;
    constructor(container: Selection, private _width: number, private _height: number) {
        this._group = container.append('g')
            .classed('map', true);
        var proj = geoMercator()
            .translate([this._width / 2, this._height / 2])
            .center([-98,40])
            .scale(600);

        var path = geoPath().projection(proj);
        json('data/counties.json', (error, data: any) => {
            if (error) {
                console.error(error);
            } else {
                console.log(data);
                this._group.append('g')
                    .selectAll('country')
                    .data(data.features)
                    .enter()
                    .append('path')
                    .classed('country', true)
                    .attr('d', path);
            }
        })

    }
}