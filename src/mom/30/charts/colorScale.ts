import { interpolateReds, interpolateGreens, interpolateBlues } from 'd3-scale-chromatic';
import { scaleSequential, ScaleSequential } from 'd3-scale';

export class colorScale {
    private _colorScale: ScaleSequential<string>;

    constructor() {
        this._colorScale = scaleSequential(interpolateGreens);
    }
    
    domain(domain: [number, number]): void {
        this._colorScale.domain(domain);
    }

    color(value: number): string {
        return this._colorScale(value);
    }
}