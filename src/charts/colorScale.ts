import { interpolateReds, interpolateGreens } from 'd3-scale-chromatic';
import { scaleSequential, Sequential } from 'd3-scale';

export class colorScale {
    private _colorScale: Sequential;

    constructor() {
        this._colorScale = scaleSequential(interpolateGreens);
    }
    domain(domain: [number, number]): void {
        this._colorScale.domain(domain);
    }

    color(value: number): number {
        return this._colorScale(value);
    }
}