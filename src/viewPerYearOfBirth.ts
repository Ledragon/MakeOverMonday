/// <reference path="title.ts" />
module app {
    export class viewPerYearOfBirth {
        private _marginTop = 50;
        private _marginBottom = 40;
        private _marginLeft = 50;
        private _marginRight = 30;
        private _container: d3.Selection<any>;

        private _scale: d3.scale.Linear<any, any>;
        private _axis: d3.svg.Axis;
        private _axisGroup: d3.Selection<any>;

        private _yScale: d3.scale.Linear<any, any>;
        private _yAxis: d3.svg.Axis;
        private _yAxisGroup: d3.Selection<any>;

        private _pathGenerator: d3.svg.Line<any>;
        private _pathGroup: d3.Selection<any>;


        // private _brush: d3.svg.Brush<any>;
        // private _brushScale: d3.scale.Linear<any, any>;
        // private _brushGroup: d3.Selection<any>;

        private _preparedData: any;

        constructor(containerId: string, private _width: number, private _height: number) {
            this._container = d3.select(`#${containerId}`)
                .attr({
                    'width': this._width,
                    'height': _height
                })
                .append('g')
                .classed('chart', true);


            var container = this._container.append('g')
                .classed('chart-container', true)
                .attr('transform', `translate(${this._marginLeft},${this._marginTop})`);
            this.initXAxis(container);
            this.initYAxis(container);
            this.initPathGenerator(container);
            // this.initPoints(container);
            new app.title(this._container, this._width, 'Total number of views according to birth year')
            // this.initBrush(this._pointsGroup);
        }

        private initXAxis(container: d3.Selection<any>) {
            this._scale = d3.scale.linear()
                .range([0, this._width - this._marginLeft - this._marginRight]);
            this._axis = d3.svg.axis()
                .scale(this._scale);
            this._axisGroup = container.append('g')
                .classed('axis', true)
                .attr('transform', `translate(${0},${this._height - this._marginBottom - this._marginTop})`)
        }

        private initYAxis(container: d3.Selection<any>) {
            this._yScale = d3.scale.linear()
                .range([this._height - this._marginBottom - this._marginTop, 0]);
            this._yAxis = d3.svg.axis()
                .orient('left')
                .scale(this._yScale)
                .tickFormat(d3.format('s'));
            this._yAxisGroup = container.append('g')
                .classed('axis', true);
        }

        private initPathGenerator(container: d3.Selection<any>) {
            this._pathGenerator = d3.svg.line()
                .x(d => this._scale(d.Birthyear))
                .y(d => this._yScale(+(d['Total Page Views'].replace(/,/g, ''))))
                .interpolate('basis');
            this._pathGroup = container.append('g')
                .append('path')
                .style({
                    'fill': 'transparent',
                    'stroke': '#C2E7D9',
                    'stroke-width': '1px'
                });
        }

        update(data: Array<any>): void {
            var years = data.map(d => +d.Birthyear)
                .sort((a, b) => a - b);
            var mapped = data.map(d => +(d['Total Page Views'].replace(/,/g, '')));
            this._scale.domain(d3.extent(years));
            this._axisGroup.call(this._axis);

            this._yScale.domain(d3.extent(mapped));
            this._yAxisGroup.call(this._yAxis);

            var prepared = data.filter(d => !!d.Birthyear)
                .sort((a, b) => a.Birthyear - b.Birthyear);
            this._pathGroup
                .attr('d', this._pathGenerator(prepared));
            this._preparedData = prepared;
        }

    }
}