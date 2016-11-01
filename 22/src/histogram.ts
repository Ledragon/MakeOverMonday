/// <reference path="title.ts" />

module app {
    export class histogram {

        private _marginLeft = 50;
        private _marginRight = 20;
        private _marginTop = 40;
        private _marginBottom = 40;
        private _container: d3.Selection<any>;
        private _histogram: d3.layout.Histogram<app.IHistory>;
        private _xScale: d3.scale.Linear<any, any>;
        private _yScale: d3.time.Scale<any, any>;
        private _yAxis: d3.svg.Axis;
        private _yAxisGroup: d3.Selection<any>;
        private _seriesGroup: d3.Selection<any>;

        constructor(container: string, width: number, height: number) {
            this._container = d3.select('#' + container)
                .attr({
                    width: width,
                    height: height
                })
                .append('g')
                .classed('chart', true)
                .attr('transform', `translate(${this._marginLeft},${0})`);

            var plotArea = this._container.append('g')
                .classed('chart-container', true)
                .attr('transform', `translate(${0},${this._marginTop})`);

            this.initAxis(plotArea, height);
            this.initXAxis(width);
            this.initHistogram();
            this._seriesGroup = plotArea.append('g')
                .classed('series', true);
            new title(this._container, width, 'Number of famous people');
        }

        private initHistogram() {
            this._histogram = d3.layout.histogram<IHistory>()
                .bins(50)
                .value(d => d.Birthyear);
        }

        private initAxis(container: d3.Selection<any>, height: number) {
            this._yScale = d3.time.scale()
                .range([0, height - this._marginTop - this._marginBottom]);

            this._yAxis = d3.svg.axis()
                .scale(this._yScale)
                .orient('left')
                .tickFormat(d3.format('YYYY'));
            this._yAxisGroup = container.append('g')
                .classed('axis', true);
        }

        private initXAxis(width: number) {
            this._xScale = d3.scale.linear()
                .range([0, width - this._marginLeft - this._marginRight]);
        }

        update(data: Array<app.IHistory>) {
            var yearsExtent = d3.extent(data, d => +d.Birthyear);
            // var delta = Math.ceil((yearsExtent[1] - yearsExtent[0]) / 100);
            this._histogram
                // .bins(delta)
                .range((d,i)=>yearsExtent);
            var split = this._histogram(data);
            this._xScale.domain([0, d3.max(split, d => d.y)]);
            this._yScale.domain(yearsExtent);
            this._yAxisGroup.call(this._yAxis);
            var dataBound = this._seriesGroup.selectAll('.bin')
                .data(split);
            dataBound.exit()
                .remove();
            dataBound.enter()
                .append('g')
                .classed('bin', true)
                .append('rect')
                .attr({
                    'x': 0,
                    'y': 0,
                    'height': 5,
                    
                })
                .style('fill', '#A6CFD5');
            dataBound
                .attr('transform', (d: any) => `translate(${0},${this._yScale(d.x)})`)
                .select('rect')
                .transition()
                .attr({
                    'width': (d: any) => {
                        return this._xScale(d.y)
                    }
                });
        }
    }
}