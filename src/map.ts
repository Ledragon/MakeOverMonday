/// <reference path="title.ts" />
module app {
    export class map {
        private _container: d3.Selection<any>;
        private _countries: d3.Selection<any>;
        private _legendGroup: d3.Selection<any>;
        private _color: any;

        private _data: any;
        
        constructor(containerId: string, width: number, height: number, mapFile:string) {
            this._container = d3.select(`#${containerId}`)
                .attr({
                    width: width,
                    height: height
                })
                .append('g')
                .classed('map', true);
            new title(this._container, width, 'Number of famous people by country');
            var countries = this._container
                .append('g')
                .classed('countries', true)
                .attr('transform', 'translate(0,50)');
            // var extent: [number, number] = [0, 1600];
            this._color = d3.scale.linear()
                // .domain(extent)
                .interpolate(d3.interpolateHcl)
                .range([d3.rgb('#C2E7D9'), d3.rgb('#0D0221')]);
            this.initMap(countries, width, height, mapFile);
            this.initLegend(this._container, width, height);

        }

        private initMap(container: d3.Selection<any>, width: number, height: number, mapFile:string) {
            var projection = d3.geo.mercator()
                .translate([width / 2, height / 2])
                .scale(height / 6);
            var pathGenerator = d3.geo.path().projection(projection);
            d3.json(mapFile, (error, geo) => {
                if (error) {
                    console.error(error);
                } else {
                    this._countries = container.selectAll('path')
                        .data(geo.features)
                        .enter()
                        .append('path')
                        .attr('d', pathGenerator)
                        .style('fill', 'lightgray');
                    if (this._data) {
                        this._countries
                            .style('fill', (d, i) => {
                                var lowerCase = d.properties.name.toLowerCase();
                                var index = this._data.find(el => el.key.toLowerCase() === lowerCase);
                                var value = index ? index.values.length : 0;
                                var c = this._color(value);
                                return c;
                            });
                    }
                }
            });
        }

        private initLegend(container: d3.Selection<any>, width: number, height: number) {
            this._legendGroup = container.append('g')
                .classed('legend', true)
                .attr('transform', `translate(10,${height - 40})`);
            var step = 1;
            var range = d3.range(0, 10 + step, step);
            var extent = d3.extent(range);
            this._color.domain(d3.extent(range));
            this._legendGroup
                .append('g')
                .selectAll('rect')
                .data(range)
                .enter()
                .append('rect')
                .attr({
                    'x': (d, i) => i * 10,
                    'y': 0,
                    'width': 10,
                    'height': 10
                })
                .style({
                    'fill': d => this._color(d)
                });
            var legnedText = this._legendGroup.append('g')
                .attr('transform', 'translate(0,25)');
            legnedText.append('text')
                .classed('first',true)
                .style({
                    'text-anchor': 'middle'
                });

            legnedText.append('text')
                .classed('last',true)
                .attr({
                    'x': range.length * 10
                })
                .style({
                    'text-anchor': 'middle'
                });
        }

        update(data: IHistory[]) {
            var key = 'Country Name';
            var nested = d3.nest()
                .key(d => d[key])
                .entries(data.filter(d => d[key] && d[key] !== "Unknown"));
            this._data = nested;
            var extent = d3.extent(nested, d => d.values.length);
            this._color.domain(extent);
            this._legendGroup.select('.first').text(extent[0]);
            this._legendGroup.select('.last').text(extent[1]);
            if (this._countries) {
                this._countries
                    .style('fill', (d, i) => {
                        var lowerCase = d.properties.name.toLowerCase();
                        var index = nested.find(el => el.key.toLowerCase() === lowerCase);
                        var value = index ? index.values.length : 0;
                        var c = this._color(value);
                        return c;
                    });
            }
            var dataBound = container.selectAll('.classed')
                .data(data);
            dataBound
              .exit()
              .remove();
            dataBound
              .enter()
              .append('g')
                .classed('classed', true);
        }
    }
}
