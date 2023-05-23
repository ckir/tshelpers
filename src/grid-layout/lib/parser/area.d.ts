import { Parser } from './base';
export declare class AreaParser extends Parser {
    parse(): string[][];
    checkAreaName(tokens: string[][], rowIndex: number, columnIndex: number): void;
}
