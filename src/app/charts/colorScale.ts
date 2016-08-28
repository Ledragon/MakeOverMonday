import { interpolateReds, interpolateGreens, interpolateBlues } from 'd3-scale-chromatic';
import { scaleLinear, ScaleLinear, ScaleSequential, scaleSequential } from 'd3-scale';

let _colorScale: ScaleLinear<number, string>;

export function blueScale() {
    return scaleSequential(interpolateBlues);
}