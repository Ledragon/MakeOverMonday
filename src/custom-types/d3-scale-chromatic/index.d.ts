declare module '~d3-scale-chromatic/index' {

    export var schemeAccent: Array<string>;
    export var schemeDark2: Array<string>;
    export var schemePaired: Array<string>;
    export var schemePastel1: Array<string>;

    export function interpolateReds(value: number): string;
    export function interpolateGreens(value: number): string;
    export function interpolateBlues(value: number): string;
}
declare module 'd3-scale-chromatic/index' {
export * from '~d3-scale-chromatic/index';
}
declare module 'd3-scale-chromatic' {
export * from '~d3-scale-chromatic/index';
}