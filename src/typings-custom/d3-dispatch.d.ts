declare module '~d3-dispatch/index' {
    export function dispatch(...args: string[]): any;
}

declare module 'd3-dispatch/index' {
    export * from '~d3-dispatch/index';
}
declare module 'd3-dispatch' {
    export * from '~d3-dispatch/index';
}
