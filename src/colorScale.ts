import { schemePaired, schemeAccent, interpolateBlues, schemePastel1 } from 'd3-scale-chromatic';


export function color(value:number): string{
    return schemePastel1[value];
}