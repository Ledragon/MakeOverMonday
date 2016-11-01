
declare module '~d3-time-format/index' {
    export function timeFormat(specifier: string): any;
    export function timeParse(specifier: string): any;
}

declare module 'd3-time-format/index' {
    export * from '~d3-time-format/index';
}
declare module 'd3-time-format' {
    export * from '~d3-time-format/index';
}