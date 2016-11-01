import { interpolateReds, interpolateGreens, interpolateBlues } from 'd3-scale-chromatic';
import { scaleLinear, ScaleLinear, ScaleSequential, scaleSequential } from 'd3-scale';

export function blueScale() {
    return scaleSequential(interpolateBlues);
}

export function redScale() {
    return scaleSequential(interpolateReds);
}