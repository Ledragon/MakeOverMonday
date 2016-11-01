declare module '~d3-collection/index' {
    export interface Nest<T> {
        key(keyFunction: (d: T) => any): this;
        entries(values: Array<T>): { key: string, values: Array<T> }[];
    }
    export function nest<T>(): Nest<T>;
}


declare module 'd3-collection/index' {
    export * from '~d3-collection/index';
}
declare module 'd3-collection' {
    export * from '~d3-collection/index';
}