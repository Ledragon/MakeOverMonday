module app {
    export class viewPerYearOfBirth {
        private _marginTop = 20;
        private _marginBottom = 50;
        private _marginLeft = 50;
        private _marginRight = 20;
        private _container: d3.Selection<any>;

        constructor(containerId: string, private _width: number, private _height: number) {
            this._container = d3.select(`#${containerId}`)
                .attr({
                    'width': this._width,
                    'height': _height
                })
                .append('g')
                .classed('chart', true)
                .attr('transform', `translate(${this._marginLeft},${this._marginTop})`);
        }

        update(data: Array<any>): void {
            var years = data.map(d => +d.Birthyear)
                .sort((a, b) => a - b);
            var scale = d3.scale.linear()
                .domain(d3.extent(years))
                .range([0, this._width - this._marginLeft - this._marginRight]);
            var axis = d3.svg.axis()
                .scale(scale);
            var axisGroup = this._container.append('g')
                .attr('transform', `translate(${0},${this._height - this._marginBottom})`)
                .call(axis);

            var colors = d3.scale.ordinal()
                .range([d3.rgb('#C2E7D9'), d3.rgb('#0D0221')])
                .domain(["Female", 'Male']);
            var pointsGroup = this._container.append('g')
                .classed('points', true)
                .attr('transform', `translate(${0},${this._height - this._marginBottom - 15})`)
            pointsGroup.append('rect')
                .attr({
                    'x': 0,
                    'y': 0,
                    width: this._width - this._marginLeft - this._marginRight,
                    height: 25,
                    'transform': 'translate(0,-10)'
                })
                .style({
                    'fill': 'transparent',
                    'stroke': 'darkgray',
                    'stroke-width': '1px'
                });
            pointsGroup
                .selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr({
                    'cx': d => scale(d.Birthyear),
                    'cy': 0,
                    'r': 2
                })
                .style({
                    'fill': d => {
                        var color: any = colors(d.Gender);
                        return `rgb(${color.r},${color.g},${color.b})`
                    }
                });

            var viewsChart = this._container.append('g')
                .classed('data-chart', true);
            var mapped = data.map(d => +(d['Total Page Views'].replace(/,/g, '')));
            var chartYScale = d3.scale.linear()
                .range([this._height - this._marginBottom - 25, 0])
                .domain(d3.extent(mapped));
            console.log(chartYScale.domain());
            var yAxis = d3.svg.axis()
                .orient('left')
                .scale(chartYScale)
                .tickFormat(d3.format('s'));
            var yAxisGroup = viewsChart.append('g')
                .attr('transform', `translate(${0},${0})`)
                .call(yAxis);

            var pathGenerator = d3.svg.line()
                .x(d => scale(d.Birthyear))
                .y(d => chartYScale(+(d['Total Page Views'].replace(/,/g, ''))))
                .interpolate('basis');

            var pathGroup = this._container.append('g')
                .append('path')
                .style({
                    'fill': 'transparent',
                    'stroke': '#C2E7D9',
                    'stroke-width':'1px'
                })
                .attr('d', pathGenerator(data.filter(d => !!d.Birthyear)
                    .sort((a, b) => a.Birthyear - b.Birthyear)));
        }
    }
}