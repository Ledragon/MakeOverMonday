import { select, Selection } from 'd3-selection';
let _container: Selection<any, any, any, any>;
let _clickCallback: (d: string) => void;

export function timeline(container: Selection<any, any, any, any>, width: number, height: number) {
    _container = container;
    return {
        update: (data: Array<string>) => {
            var dataBound = container.selectAll('.year')
                .data(data);
            dataBound
                .exit()
                .remove();
            let divs = dataBound
                .enter()
                .append('div')
                .classed('year', true);
            divs.append('span')
                .text(d => d);
            divs.on('click', function (d) {
                divs.style('background', '');
                console.log(d)
                select(this)
                    .style('background', 'darkgray');
                if (_clickCallback) {
                    _clickCallback(d);
                }
            });
        },
        clickCallback: (value: (d: string) => void) => {
            _clickCallback = value;
        }
    }
}