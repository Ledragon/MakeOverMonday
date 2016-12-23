import { schemePaired, schemeAccent, schemeSet1, interpolateBlues, schemePastel1, interpolateReds, interpolateGreens } from 'd3-scale-chromatic';


export function color(value:number): string{
    return schemePastel1[value];
}

export const red = schemeSet1[0];
export const green = schemeSet1[2];