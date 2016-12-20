import { interpolateReds, interpolateGreens } from 'd3-scale-chromatic';
import { scaleSequential, ScaleSequential } from 'd3';

export class colorScale {
    private _colorScale: ScaleSequential<any>;

    constructor() {
        this._colorScale = scaleSequential(interpolateReds);
    }
    domain(domain: [number, number]): void {
        this._colorScale.domain(domain);
    }

    color(value: number): number {
        return this._colorScale(value);
    }
}