module app {
    export class brush {
        private _marginTop = 5;
        private _marginBottom = 30;
        private _marginLeft = 20;
        private _marginRight = 20;
        private _brush: d3.svg.Brush<any>;
        private _brushScale: d3.scale.Linear<any, any>;
        private _container: d3.Selection<any>;
        private _brushGroup: d3.Selection<any>;
        private _dispatch: d3.Dispatch;
        private _genderColorScale: d3.scale.Ordinal<any, any>;
        private _pointsGroup: d3.Selection<any>;


        private _axisGroup: d3.Selection<any>;
        private _axis: d3.svg.Axis;

        constructor(containerId: string, private _width: number, private _height: number) {
            this._container = d3.select(`#${containerId}`)
                .attr({
                    'width': this._width,
                    'height': _height
                })
                .append('g')
                .classed('chart', true)
                .attr('transform', `translate(${this._marginLeft},${this._marginTop})`);
            this.initPoints(this._container);
            this.initBrush(this._container);
            this.initAxisGroup(this._container);
            this._dispatch = d3.dispatch('brushed');
        }

        dispatch() {
            return this._dispatch;
        }

        private initPoints(container: d3.Selection<any>) {
            this._genderColorScale = d3.scale.ordinal()
                .range([d3.rgb('#C2E7D9'), d3.rgb('#0D0221')])
                .domain(["Female", 'Male']);
            this._pointsGroup = container.append('g')
                .classed('points', true)
                .attr('transform', `translate(${0},${10})`);

        }
        private initBrush(container: d3.Selection<any>) {

            this._brushGroup = container.append('g')
                .classed('brush', true);
            this._brushScale = d3.scale.linear()
                .range([0, this._width - this._marginLeft - this._marginRight]);
            this._brush = d3.svg.brush()
                .x(this._brushScale)
                .on('brush', (d, i) => {
                    if (!this._brush.empty()) {
                        this._dispatch.brushed(this._brush.extent());
                    }
                });
        }
        private initAxisGroup(container) {
            this._axis = d3.svg.axis()
                .scale(this._brushScale);
            this._axisGroup = container.append('g')
                .classed('axis', true)
                .attr('transform', `translate(${0},${this._height - this._marginBottom})`);

        }

        update(data: IHistory[]) {
            this._brushScale.domain(d3.extent(data, d => +d.Birthyear));
            this.updatePoints(data);
            this._brushGroup.call(this._brush)
                .selectAll('rect')
                .attr({
                    'height': this._height-this._marginBottom,
                });
            this._axisGroup.call(this._axis);
        }

        private updatePoints(data: IHistory[]) {
            this._pointsGroup
                .selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr({
                    'cx': d => this._brushScale(+d.Birthyear),
                    'cy': 0,
                    'r': 2
                })
                .style({
                    'fill': d => {
                        var color: any = this._genderColorScale(d.Gender);
                        return `rgb(${color.r},${color.g},${color.b})`
                    }
                });
        }
    }
}