export declare const deepmerge: (obj: any) => any;
export declare function parseAlignSpace(space: number, type: string, num: number): number[];
export declare function parsePercentValue(value: string): false | number;
export declare function parseMarginAuto(value: string | number, autoValue?: number): string | number;
export declare function parseNumberValue(value: string | number, parentValue?: number): string | number;
export declare function parseMinMaxValue(value: number, min: number, max: number): number;
export declare function parseCombineValue<T>(value: T | T[]): T[];
