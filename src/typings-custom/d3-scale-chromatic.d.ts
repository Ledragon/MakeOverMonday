declare module '~d3-scale-chromatic/index' {
    export function schemeAccent(value: number): string;
    export function interpolateReds(value: number): string;
    export function interpolateGreens(value: number): string;
}

declare module 'd3-scale-chromatic/index' {
    export * from '~d3-scale-chromatic/index';
}
declare module 'd3-scale-chromatic' {
    export * from '~d3-scale-chromatic/index';
}